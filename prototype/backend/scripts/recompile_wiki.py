#!/usr/bin/env python3
"""Recompile wiki topics from the approved local PBO PDFs."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.compiler import compile_topic

TOPICS = [
    (
        "What is a Public Benefit Organization (PBO)?",
        "what-is-a-pbo",
        "pbo-act-2013.pdf",
    ),
    (
        "PBO Registration Requirements",
        "registration-requirements",
        "pbo-act-2013.pdf",
    ),
    (
        "PBO Registration Process and Timeline",
        "registration-process-and-timeline",
        "pbo-regulations-2026.pdf",
    ),
    (
        "Objects and Purpose of the PBO Act",
        "objects-and-purpose-of-the-act",
        "pbo-act-2013.pdf",
    ),
    (
        "PBO Regulatory Authority and Public Registry",
        "pbo-regulatory-authority",
        "pbo-act-2013.pdf",
    ),
    (
        "PBO Regulations 2026 — Overview for NGOs",
        "pbo-regulations-overview",
        "pbo-regulations-2026.pdf",
    ),
]


def main() -> None:
    for topic, slug, source in TOPICS:
        print(f"Compiling {slug} from {source}…")
        result = compile_topic(topic, slug, source)
        print(result)


if __name__ == "__main__":
    main()
