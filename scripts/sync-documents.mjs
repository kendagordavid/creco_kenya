#!/usr/bin/env node
/** Copy approved PBO PDFs into public/documents and prototype/backend/data. */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const SOURCES = [
  {
    src: path.join(root, "PBO ACT 2013.pdf"),
    filename: "pbo-act-2013.pdf",
  },
  {
    src: path.join(
      root,
      "Kenya Gazette Supplement No. 67 Legal Notice No. 43 - PBO Regulations.pdf",
    ),
    filename: "pbo-regulations-2026.pdf",
  },
];

const DEST_DIRS = [
  path.join(root, "public", "documents"),
  path.join(root, "prototype", "backend", "data"),
];

for (const dir of DEST_DIRS) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const { src, filename } of SOURCES) {
  if (!fs.existsSync(src)) {
    console.error(`Missing source PDF: ${src}`);
    process.exit(1);
  }
  for (const dir of DEST_DIRS) {
    const dest = path.join(dir, filename);
    fs.copyFileSync(src, dest);
    console.log(`Copied ${filename} → ${dest}`);
  }
}

console.log("Document sync complete.");
