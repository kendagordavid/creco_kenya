"""Compile raw PDF sources into structured wiki pages (LLM Wiki pattern)."""

from __future__ import annotations

import re
from pathlib import Path

from openai import OpenAI
from pypdf import PdfReader

from app.config import settings

SOURCE_DOCUMENTS = [
    {
        "filename": "pbo-act-popular-version.pdf",
        "title": "PBO Act 2013 — Popular Version",
        "url": "https://www.pbora.go.ke/sites/default/files/PBORA/PBO%20ACT%202013%20Popular%20version.pdf",
    },
    {
        "filename": "icj-pbo-act-analysis.pdf",
        "title": "ICJ Kenya — Analysis of the PBO Act 2013",
        "url": "https://icj-kenya.org/wp-content/uploads/2024/05/Analysis-of-the-provisions-of-the-Public-Benefit-Organizations-Act-2013-PBO-Act.pdf",
    },
    {
        "filename": "pbo-act-official.pdf",
        "title": "Public Benefit Organizations Act, 2013 (Official)",
        "url": "https://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/PublicBenefitsOrganisationNo18of2013.PDF",
    },
]

COMPILE_PROMPT = """You are compiling approved PBO Act source material into a structured Markdown wiki page.

Create ONE focused wiki page with:
- YAML frontmatter (slug, title, tags, related slugs, source_documents with id/title/url/sections)
- Clear headings and plain-language explanations
- [[wikilink]] references to related topics where appropriate
- A brief Kiswahili summary section if the topic is user-facing
- NO invented legal requirements — only content supported by the source text

Topic to compile: {topic}
Suggested slug: {slug}

Source text:
{source_text}
"""


def extract_pdf_text(path: Path) -> str:
    reader = PdfReader(str(path))
    pages = [page.extract_text() or "" for page in reader.pages]
    text = "\n\n".join(pages)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def compile_topic(topic: str, slug: str, source_filename: str) -> dict:
    if not settings.openai_api_key:
        return {"status": "error", "message": "OPENAI_API_KEY required for compilation"}

    path = settings.data_dir / source_filename
    if not path.exists():
        return {"status": "error", "message": f"Source file not found: {source_filename}"}

    source_text = extract_pdf_text(path)[:12000]
    client = OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.2,
        messages=[
            {
                "role": "user",
                "content": COMPILE_PROMPT.format(
                    topic=topic,
                    slug=slug,
                    source_text=source_text,
                ),
            }
        ],
    )

    content = response.choices[0].message.content or ""
    if not content.strip():
        return {"status": "error", "message": "Empty compilation result"}

    output_dir = settings.wiki_dir / "topics"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{slug}.md"
    output_path.write_text(content.strip() + "\n", encoding="utf-8")

    return {"status": "ok", "path": str(output_path), "slug": slug}
