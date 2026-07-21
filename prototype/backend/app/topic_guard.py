"""Scope gate — refuse off-topic questions before calling OpenAI."""

from __future__ import annotations

import re

OFF_TOPIC_REFUSAL = (
    "This tool only answers questions about **Kenyan Public Benefit Organizations**, "
    "the **PBO Act**, **NGO/CSO registration and compliance**, and **CRECO-related civic guidance**. "
    "Please rephrase your question in that context, browse **Topics**, or contact **CRECO Kenya**."
)

ON_TOPIC_PATTERNS = [
    re.compile(p, re.I)
    for p in [
        r"\bpbo\b",
        r"\bngo\b",
        r"\bcso\b",
        r"\bcreco\b",
        r"\bicnl\b",
        r"public benefit",
        r"non[- ]?profit",
        r"registration",
        r"register",
        r"sajili",
        r"pbo act",
        r"compliance",
        r"civic space",
        r"civil society",
        r"tax exempt",
        r"by-?laws",
        r"charitable",
    ]
]

OFF_TOPIC_PATTERNS = [
    re.compile(p, re.I)
    for p in [
        r"\bweather\b",
        r"\bfootball\b",
        r"\brecipe\b",
        r"\bbitcoin\b",
        r"\bwrite (me )?(a )?(poem|story|code)\b",
        r"\bpython\b",
        r"\bcapital of\b",
        r"\bmovie\b",
    ]
]


def heuristic_topic_scope(question: str, wiki_match_score: int) -> str:
    q = question.strip()
    if len(q) < 3:
        return "off_topic"
    if any(p.search(q) for p in OFF_TOPIC_PATTERNS):
        return "off_topic"
    if wiki_match_score >= 2:
        return "on_topic"
    if any(p.search(q) for p in ON_TOPIC_PATTERNS):
        return "on_topic"
    return "unclear"


def classify_with_model(question: str, client, model: str) -> str:
    try:
        response = client.chat.completions.create(
            model=model,
            temperature=0,
            max_tokens=8,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You gate questions for CRECO Kenya's PBO Act guidance site. "
                        "ON TOPIC: Kenya PBO Act, PBO/NGO/CSO registration or compliance, CRECO, civic space. "
                        "OFF TOPIC: everything else. Reply with exactly one word: ON or OFF."
                    ),
                },
                {"role": "user", "content": question[:500]},
            ],
        )
        text = (response.choices[0].message.content or "").strip().upper()
        if text.startswith("ON"):
            return "on_topic"
        if text.startswith("OFF"):
            return "off_topic"
    except Exception:
        pass
    return "unclear"


def resolve_topic_scope(question: str, wiki_match_score: int, *, openai_ok: bool, client=None, model: str = "") -> str:
    heuristic = heuristic_topic_scope(question, wiki_match_score)
    if heuristic in ("on_topic", "off_topic"):
        return heuristic
    if not openai_ok or client is None:
        return "on_topic" if wiki_match_score > 0 else "off_topic"
    model_scope = classify_with_model(question, client, model)
    if model_scope != "unclear":
        return model_scope
    return "on_topic" if wiki_match_score > 0 else "off_topic"
