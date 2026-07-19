#!/usr/bin/env python3
"""Download approved PBO Act PDFs into the data directory."""

from __future__ import annotations

import sys
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import settings
from app.ingest import SOURCE_DOCUMENTS


def download_all() -> None:
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    with httpx.Client(timeout=60.0, follow_redirects=True) as client:
        for doc in SOURCE_DOCUMENTS:
            dest = settings.data_dir / doc["filename"]
            if dest.exists() and dest.stat().st_size > 1000:
                print(f"skip  {doc['filename']} (already exists)")
                continue
            print(f"fetch {doc['url']}")
            response = client.get(doc["url"])
            response.raise_for_status()
            dest.write_bytes(response.content)
            print(f"saved {dest} ({len(response.content):,} bytes)")


if __name__ == "__main__":
    download_all()
