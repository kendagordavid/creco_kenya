"""LLM Wiki query pipeline — search compiled wiki pages, answer from reviewed content."""

from __future__ import annotations

from openai import OpenAI

from app.config import settings
from app.wiki_store import WikiPage, search_wiki

SYSTEM_PROMPT = """You are the CRECO Kenya PBO Act assistant. You answer questions using ONLY the compiled wiki pages provided below.

These wiki pages were compiled from CRECO-approved PBO Act source documents. They are the authoritative knowledge base — not raw document chunks.

STRICT RULES:
1. Answer ONLY using the provided wiki page content. Do not use outside knowledge.
2. Cite wiki pages inline using [Wiki: page-slug] markers.
3. Reference underlying source documents when mentioned in the wiki pages.
4. Use plain, accessible language for NGO staff who are not lawyers.
5. Include a brief note that this is informational guidance, not legal advice.
6. If asked in Kiswahili, respond in Kiswahili using the wiki content.
7. If the wiki pages do not contain enough information, say so and suggest contacting CRECO Kenya."""

REFUSAL_MESSAGE = (
    "I couldn't find a matching topic in the compiled PBO Act wiki for that question. "
    "Please try rephrasing, browse the wiki topics, or contact CRECO Kenya for guidance."
)


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


def _format_wiki_context(pages: list[WikiPage]) -> str:
    parts: list[str] = []
    for page in pages:
        parts.append(f"## Wiki page: {page.title} (slug: {page.slug})\n\n{page.body}")
    return "\n\n---\n\n".join(parts)


def _compose_direct_answer(pages: list[WikiPage]) -> str:
    primary = pages[0]
    excerpt = _first_paragraph(primary.body)
    related = ", ".join(f"[[{slug}]]" for slug in primary.related[:3])

    answer = (
        f"Based on the compiled wiki page **{primary.title}**:\n\n"
        f"{excerpt}\n\n"
        f"*Source: [Wiki: {primary.slug}]*"
    )
    if related:
        answer += f"\n\nRelated topics: {related}"
    answer += "\n\n*This is informational guidance, not legal advice.*"
    return answer


def generate_answer(question: str, pages: list[WikiPage]) -> str:
    if not settings.openai_api_key:
        return _compose_direct_answer(pages)

    context = _format_wiki_context(pages)
    client = OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.2,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
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


def ask(question: str) -> dict:
    question = question.strip()
    if not question:
        return {
            "answer": "Please enter a question about the PBO Act.",
            "citations": [],
            "confidence": "low",
            "refused": True,
        }

    pages = search_wiki(question)
    if not pages:
        return {
            "answer": REFUSAL_MESSAGE,
            "citations": [],
            "confidence": "low",
            "refused": True,
        }

    citations = _pages_to_citations(pages)
    confidence = "high" if len(pages) >= 2 else "medium"

    try:
        answer = generate_answer(question, pages)
    except Exception as exc:
        return {
            "answer": str(exc),
            "citations": citations,
            "confidence": confidence,
            "refused": True,
        }

    return {
        "answer": answer,
        "citations": citations,
        "confidence": confidence,
        "refused": False,
    }
