"""LLM Wiki query pipeline — search compiled wiki pages, answer with optional OpenAI."""

from __future__ import annotations

import re

from openai import OpenAI

from app.config import openai_configured, settings
from app.topic_guard import OFF_TOPIC_REFUSAL, resolve_topic_scope
from app.wiki_store import WikiPage, search_wiki

WIKI_STRONG_SCORE = 4

WIKI_SYSTEM_PROMPT = """You are the CRECO Kenya PBO Act assistant. You answer questions using the compiled wiki pages provided below.

These wiki pages were compiled from CRECO-approved PBO Act source documents.

Rules:
1. Ground answers in the wiki content. Cite wiki pages inline using [Wiki: page-slug] markers.
2. Use plain, accessible language for NGO staff who are not lawyers.
3. Include a brief note that this is informational guidance, not legal advice.
4. If asked in Kiswahili, respond in Kiswahili using the wiki content when available."""

SUPPLEMENTAL_SYSTEM_PROMPT = """You are the CRECO Kenya PBO Act assistant. The user's question did not match the compiled CRECO topic library well enough.

Rules:
1. Answer helpfully about Kenya's Public Benefit Organization Act 2013 and PBO/NGO registration in Kenya.
2. Clearly note what should be verified with CRECO Kenya or legal counsel.
3. Do not invent section numbers or direct quotes. If unsure, say so.
4. End with a brief note that this is informational guidance, not legal advice."""

REFUSAL_MESSAGE = (
    "I couldn't find a matching topic in the compiled PBO Act wiki for that question. "
    "Please try rephrasing, browse the wiki topics, or contact CRECO Kenya for guidance."
)

REFERENCE_CITATIONS = [
    {
        "index": 1,
        "wiki_slug": "pbo-act-2013",
        "wiki_title": "Public Benefit Organization Act, 2013 (Kenya)",
        "excerpt": "Primary legislation for PBO registration and regulation in Kenya.",
        "relevance": 0.85,
        "source_id": "kenya-pbo-act",
        "source_title": "PBO Act 2013 — ICNL resource hub",
        "source_url": "https://www.icnl.org/resources/research/kenya-public-benefit-organizations-act",
        "source_type": "reference",
    },
]


def _pages_to_citations(pages: list[WikiPage]) -> list[dict]:
    citations: list[dict] = []
    for i, page in enumerate(pages, start=1):
        primary_source = page.source_documents[0] if page.source_documents else None
        citations.append(
            {
                "index": i,
                "wiki_slug": page.slug,
                "wiki_title": page.title,
                "excerpt": _first_paragraph(page.body)[:400],
                "relevance": round(max(0.5, 1.0 - (i - 1) * 0.12), 3),
                "source_id": primary_source.id if primary_source else page.slug,
                "source_title": primary_source.title if primary_source else page.title,
                "source_url": primary_source.url if primary_source else "",
                "source_type": "wiki",
            }
        )
    return citations


def _first_paragraph(body: str) -> str:
    for block in body.split("\n\n"):
        cleaned = block.strip()
        if cleaned and not cleaned.startswith("#"):
            return cleaned[:400]
    return body[:400]


def _extract_answer_body(page: WikiPage, max_chars: int = 1800) -> str:
    lines: list[str] = []
    for block in page.body.split("\n\n"):
        block = block.strip()
        if not block or block.startswith("#"):
            continue
        if block.startswith("## "):
            lines.append(f"\n**{block[3:].strip()}**")
            continue
        if block.startswith("- "):
            for item in block.split("\n"):
                item = item.strip()
                if item.startswith("- "):
                    lines.append(f"• {item[2:].strip()}")
            continue
        lines.append(block)
        if sum(len(line) for line in lines) > max_chars:
            break

    text = "\n".join(lines).strip()
    if len(text) > max_chars:
        text = text[: max_chars - 1].rsplit("\n", 1)[0] + "…"
    return text or _first_paragraph(page.body)


def _format_wiki_context(pages: list[WikiPage]) -> str:
    parts: list[str] = []
    for page in pages:
        parts.append(f"## Wiki page: {page.title} (slug: {page.slug})\n\n{page.body}")
    return "\n\n---\n\n".join(parts)


def _compose_direct_answer(pages: list[WikiPage]) -> str:
    primary = pages[0]
    body = _extract_answer_body(primary)
    related = ", ".join(f"[[{slug}]]" for slug in primary.related[:3])

    answer = (
        f"Based on the compiled topic **{primary.title}**:\n\n"
        f"{body}\n\n"
        f"*Source: [Wiki: {primary.slug}]*"
    )
    if len(pages) > 1:
        others = ", ".join(p.title for p in pages[1:3])
        answer += f"\n\n*Also see:* {others}"
    if related:
        answer += f"\n\n*Related topics:* {related}"
    answer += "\n\n*This is informational guidance, not legal advice.*"
    return answer


def _wiki_match_score(question: str, pages: list[WikiPage]) -> int:
    if not pages:
        return 0
    terms = re.findall(r"\w{3,}", question.lower())
    primary = pages[0]
    slug_text = primary.slug.replace("-", " ")
    haystack = f"{primary.title} {primary.body} {' '.join(primary.tags)} {slug_text}".lower()
    score = sum(1 for t in terms if t in haystack)
    if any(t in slug_text or t in primary.title.lower() for t in terms):
        score += 3
    return score


def _openai_client() -> OpenAI:
    return OpenAI(api_key=settings.openai_api_key)


def generate_wiki_answer(question: str, pages: list[WikiPage]) -> str:
    context = _format_wiki_context(pages)
    client = _openai_client()
    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            temperature=0.2,
            messages=[
                {"role": "system", "content": WIKI_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"Question: {question}\n\n"
                        f"Compiled wiki pages:\n\n{context}\n\n"
                        "Provide a helpful answer citing [Wiki: slug] markers."
                    ),
                },
            ],
        )
        return response.choices[0].message.content or _compose_direct_answer(pages)
    except Exception:
        return _compose_direct_answer(pages)


def generate_supplemental_answer(question: str, weak_pages: list[WikiPage]) -> str:
    partial = ""
    if weak_pages:
        partial = (
            "\n\nPartially related wiki content:\n"
            + _format_wiki_context(weak_pages[:2])
        )
    client = _openai_client()
    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            temperature=0.25,
            messages=[
                {"role": "system", "content": SUPPLEMENTAL_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"Question: {question}{partial}\n\n"
                        "Provide a careful general answer about Kenya PBO law and practice."
                    ),
                },
            ],
        )
        text = response.choices[0].message.content or ""
        if text and "not legal advice" not in text.lower():
            text += (
                "\n\n*This draws on general PBO Act context where CRECO’s compiled library "
                "does not fully cover your question. Verify with CRECO Kenya.*"
            )
        return text or REFUSAL_MESSAGE
    except Exception:
        return REFUSAL_MESSAGE


def ask(question: str) -> dict:
    question = question.strip()
    if not question:
        return {
            "answer": "Please enter a question about the PBO Act.",
            "citations": [],
            "confidence": "low",
            "refused": True,
            "answer_mode": "wiki_direct",
        }

    pages = search_wiki(question)
    score = _wiki_match_score(question, pages)
    strong = pages and score >= WIKI_STRONG_SCORE

    if strong:
        citations = _pages_to_citations(pages)
        confidence = "high" if len(pages) >= 2 else "medium"
        if openai_configured():
            answer = generate_wiki_answer(question, pages)
            return {
                "answer": answer,
                "citations": citations,
                "confidence": confidence,
                "refused": False,
                "answer_mode": "openai_wiki",
            }
        return {
            "answer": _compose_direct_answer(pages),
            "citations": citations,
            "confidence": confidence,
            "refused": False,
            "answer_mode": "wiki_direct",
        }

    if openai_configured():
        client = _openai_client()
        scope = resolve_topic_scope(
            question,
            score,
            openai_ok=True,
            client=client,
            model=settings.openai_model,
        )
        if scope == "off_topic":
            return {
                "answer": OFF_TOPIC_REFUSAL,
                "citations": [],
                "confidence": "low",
                "refused": True,
                "answer_mode": "wiki_direct",
            }
        answer = generate_supplemental_answer(question, pages)
        refused = answer == REFUSAL_MESSAGE
        citations = _pages_to_citations(pages) if pages else REFERENCE_CITATIONS
        return {
            "answer": answer,
            "citations": citations,
            "confidence": "medium" if pages else "low",
            "refused": refused,
            "answer_mode": "openai_supplemental",
        }

    if pages:
        citations = _pages_to_citations(pages)
        return {
            "answer": _compose_direct_answer(pages),
            "citations": citations,
            "confidence": "medium",
            "refused": False,
            "answer_mode": "wiki_direct",
        }

    return {
        "answer": REFUSAL_MESSAGE,
        "citations": [],
        "confidence": "low",
        "refused": True,
        "answer_mode": "wiki_direct",
    }
