#!/usr/bin/env python3
"""Copy approved PBO PDFs from the repo into the backend data directory."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.compiler import SOURCE_DOCUMENTS
from app.config import settings

ROOT = Path(__file__).resolve().parents[3]
SOURCE_FILES = {
    "pbo-act-2013.pdf": ROOT / "PBO ACT 2013.pdf",
    "pbo-regulations-2026.pdf": ROOT
    / "Kenya Gazette Supplement No. 67 Legal Notice No. 43 - PBO Regulations.pdf",
}


def sync_documents() -> None:
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    public_dir = ROOT / "public" / "documents"
    public_dir.mkdir(parents=True, exist_ok=True)

    for doc in SOURCE_DOCUMENTS:
        filename = doc["filename"]
        src = SOURCE_FILES.get(filename)
        if not src or not src.exists():
            raise FileNotFoundError(f"Missing source PDF for {filename}: {src}")

        for dest_dir in (settings.data_dir, public_dir):
            dest = dest_dir / filename
            shutil.copy2(src, dest)
            print(f"copied {filename} → {dest}")


if __name__ == "__main__":
    sync_documents()
