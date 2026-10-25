#!/usr/bin/env node
/**
 * Split each form out of the PBO Regulations PDF and render page previews into public/forms.
 * Needs Ghostscript (gs) and poppler-utils (pdftoppm). Page ranges live in
 * lib/content/regulation-forms.ts.
 */

import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { REGULATION_FORMS } from "../lib/content/regulation-forms.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, "public", "documents", "pbo-regulations-2026.pdf");
const outDir = path.join(root, "public", "forms");
const PREVIEW_DPI = "100";
const JPEG_QUALITY = "70";

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const work = fs.mkdtempSync(path.join(os.tmpdir(), "pbo-forms-"));

try {
  for (const form of REGULATION_FORMS) {
    const [first, last] = form.pages;
    // Ghostscript re-subsets fonts, so a form's PDF stays small instead of carrying the whole document's.
    execFileSync("gs", [
      "-q",
      "-dNOPAUSE",
      "-dBATCH",
      "-sDEVICE=pdfwrite",
      "-dPDFSETTINGS=/ebook",
      `-dFirstPage=${first}`,
      `-dLastPage=${last}`,
      `-sOutputFile=${path.join(outDir, `form-${form.id}.pdf`)}`,
      source,
    ]);

    execFileSync("pdftoppm", [
      "-jpeg",
      "-jpegopt",
      `quality=${JPEG_QUALITY}`,
      "-r",
      PREVIEW_DPI,
      "-f",
      String(first),
      "-l",
      String(last),
      source,
      path.join(work, `preview-${form.id}`),
    ]);
    const previews = fs
      .readdirSync(work)
      .filter((name) => name.startsWith(`preview-${form.id}-`))
      .sort();
    previews.forEach((name, index) => {
      fs.copyFileSync(path.join(work, name), path.join(outDir, `form-${form.id}-page-${index + 1}.jpg`));
    });

    console.log(`${form.name}: pages ${first}–${last}, ${previews.length} preview(s)`);
  }
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
