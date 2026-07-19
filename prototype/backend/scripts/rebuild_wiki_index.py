#!/usr/bin/env python3
"""Rebuild the full-text search index from compiled wiki pages."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.wiki_store import rebuild_index

if __name__ == "__main__":
    result = rebuild_index()
    print(f"Indexed {result['pages']} wiki pages")
