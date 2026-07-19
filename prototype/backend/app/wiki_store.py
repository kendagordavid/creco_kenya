"""Wiki store — load compiled Markdown pages and full-text search index."""

from __future__ import annotations

import re
import sqlite3
from dataclasses import dataclass, field
from pathlib import Path

from app.config import settings

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n(.*)", re.DOTALL)


@dataclass
class SourceDocument:
    id: str
    title: str
    url: str
    sections: list[str] = field(default_factory=list)


@dataclass
class WikiPage:
    slug: str
    title: str
    path: Path
    body: str
    tags: list[str]
    related: list[str]
    source_documents: list[SourceDocument]
    excerpt: str = ""


def _parse_frontmatter(text: str) -> tuple[dict, str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text

    meta: dict = {}
    for line in match.group(1).splitlines():
        if not line or line.startswith(" ") or line.startswith("\t"):
            continue
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value.startswith("[") and value.endswith("]"):
            meta[key] = [item.strip() for item in value[1:-1].split(",") if item.strip()]
        else:
            meta[key] = value.strip('"')

    return meta, match.group(2).strip()


def _parse_source_documents(raw_meta: dict) -> list[SourceDocument]:
    # Frontmatter lists are flattened in simple parser; source docs parsed from file when needed.
    return []


def load_wiki_page(path: Path) -> WikiPage | None:
    text = path.read_text(encoding="utf-8")
    meta, body = _parse_frontmatter(text)

    slug = meta.get("slug") or path.stem
    title = meta.get("title") or slug.replace("-", " ").title()
    tags = meta.get("tags", [])
    if isinstance(tags, str):
        tags = [tags]

    related = meta.get("related", [])
    if isinstance(related, str):
        related = [related]

    source_documents = _extract_source_documents(text)

    return WikiPage(
        slug=slug,
        title=title,
        path=path,
        body=body,
        tags=tags,
        related=related if isinstance(related, list) else [],
        source_documents=source_documents,
    )


def _extract_source_documents(text: str) -> list[SourceDocument]:
    docs: list[SourceDocument] = []
    in_block = False
    current: dict[str, str] = {}

    for line in text.splitlines():
        if line.strip() == "source_documents:":
            in_block = True
            continue
        if in_block:
            if line.startswith("  - id:"):
                if current.get("id"):
                    docs.append(
                        SourceDocument(
                            id=current.get("id", ""),
                            title=current.get("title", ""),
                            url=current.get("url", ""),
                            sections=_parse_sections(current.get("sections", "")),
                        )
                    )
                current = {"id": line.split(":", 1)[1].strip()}
            elif line.startswith("    title:"):
                current["title"] = line.split(":", 1)[1].strip()
            elif line.startswith("    url:"):
                current["url"] = line.split(":", 1)[1].strip()
            elif line.startswith("    sections:"):
                current["sections"] = line.split(":", 1)[1].strip()
            elif line.startswith("---") or (line.startswith("slug:") and not line.startswith("    ")):
                break

    if current.get("id"):
        docs.append(
            SourceDocument(
                id=current.get("id", ""),
                title=current.get("title", ""),
                url=current.get("url", ""),
                sections=_parse_sections(current.get("sections", "")),
            )
        )

    return docs


def _parse_sections(raw: str) -> list[str]:
    raw = raw.strip()
    if raw.startswith("[") and raw.endswith("]"):
        return [item.strip().strip('"') for item in raw[1:-1].split(",") if item.strip()]
    return [raw] if raw else []


def discover_wiki_pages() -> list[WikiPage]:
    wiki_dir = settings.wiki_dir
    pages: list[WikiPage] = []
    for path in sorted(wiki_dir.rglob("*.md")):
        if path.name == "index.md" and path.parent == wiki_dir:
            continue
        page = load_wiki_page(path)
        if page:
            pages.append(page)
    return pages


def get_db_path() -> Path:
    settings.wiki_index_dir.mkdir(parents=True, exist_ok=True)
    return settings.wiki_index_dir / "wiki_fts.db"


def rebuild_index() -> dict:
    pages = discover_wiki_pages()
    db_path = get_db_path()

    if db_path.exists():
        db_path.unlink()

    conn = sqlite3.connect(db_path)
    conn.execute(
        """
        CREATE VIRTUAL TABLE wiki_pages USING fts5(
            slug,
            title,
            body,
            tags,
            tokenize='porter unicode61'
        )
        """
    )

    for page in pages:
        conn.execute(
            "INSERT INTO wiki_pages(slug, title, body, tags) VALUES (?, ?, ?, ?)",
            (page.slug, page.title, page.body, " ".join(page.tags)),
        )

    conn.commit()
    conn.close()

    return {"status": "ok", "pages": len(pages)}


def search_wiki(query: str, limit: int | None = None) -> list[WikiPage]:
    limit = limit or settings.top_k
    pages_by_slug = {p.slug: p for p in discover_wiki_pages()}
    if not pages_by_slug:
        return []

    db_path = get_db_path()
    if not db_path.exists():
        rebuild_index()

    terms = [t for t in re.findall(r"\w+", query.lower()) if len(t) > 2]
    if not terms:
        return []

    match_query = " OR ".join(f'"{term}"' for term in terms)

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT slug, title, snippet(wiki_pages, 2, '[', ']', '…', 20) AS excerpt,
               bm25(wiki_pages) AS rank
        FROM wiki_pages
        WHERE wiki_pages MATCH ?
        ORDER BY rank
        LIMIT ?
        """,
        (match_query, limit * 3),
    ).fetchall()
    conn.close()

    query_lower = query.lower()
    scored: list[tuple[float, WikiPage]] = []

    for row in rows:
        page = pages_by_slug.get(row["slug"])
        if not page:
            continue

        page.excerpt = row["excerpt"]
        score = -row["rank"]  # bm25 returns negative values; lower is better

        slug_text = page.slug.replace("-", " ")
        title_lower = page.title.lower()
        tags_lower = " ".join(page.tags).lower()

        if any(term in slug_text or term in title_lower or term in tags_lower for term in terms):
            score += 3
        if any(kw in query_lower for kw in ("register", "registration", "sajili", "mahitaji", "document")):
            if "registration" in page.slug:
                score += 5
        if any(kw in query_lower for kw in ("what is", "definition", "nini", "pbo")):
            if "what-is" in page.slug:
                score += 3
        if any(kw in query_lower for kw in ("how long", "timeline", "days", "siku")):
            if "timeline" in page.slug or "process" in page.slug:
                score += 5

        scored.append((score, page))

    scored.sort(key=lambda item: item[0], reverse=True)
    return [page for _, page in scored[:limit]]


def list_source_documents() -> list[dict]:
    seen: dict[str, dict] = {}
    for page in discover_wiki_pages():
        for doc in page.source_documents:
            if doc.id not in seen:
                seen[doc.id] = {
                    "id": doc.id,
                    "title": doc.title,
                    "url": doc.url,
                    "type": "source",
                }
    return list(seen.values())


def list_wiki_pages() -> list[dict]:
    return [
        {
            "slug": page.slug,
            "title": page.title,
            "tags": page.tags,
            "related": page.related,
        }
        for page in discover_wiki_pages()
    ]
