import fs from "fs";
import path from "path";

/** Canonical PBO source documents served from /public/documents. */
export type PlatformDocument = {
  id: string;
  title: string;
  url: string;
  type: "legislation" | "regulations" | "reference";
  filename: string;
};

export const PLATFORM_DOCUMENTS: PlatformDocument[] = [
  {
    id: "pbo-act-2013",
    title: "Public Benefit Organizations Act, 2013 (No. 18 of 2013)",
    url: "/documents/pbo-act-2013.pdf",
    type: "legislation",
    filename: "pbo-act-2013.pdf",
  },
  {
    id: "pbo-regulations-2026",
    title: "Public Benefit Organizations Regulations, 2026 (Legal Notice No. 43)",
    url: "/documents/pbo-regulations-2026.pdf",
    type: "regulations",
    filename: "pbo-regulations-2026.pdf",
  },
];

const DOCUMENTS_DIR = path.join(process.cwd(), "public", "documents");
const EXTRA_MANIFEST_PATH = path.join(process.cwd(), "data", "source-documents.json");

function humanizePdfFilename(filename: string): string {
  const base = filename.replace(/\.pdf$/i, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function loadExtraManifest(): PlatformDocument[] {
  if (!fs.existsSync(EXTRA_MANIFEST_PATH)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(EXTRA_MANIFEST_PATH, "utf-8")) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPlatformDocument);
  } catch {
    return [];
  }
}

function isPlatformDocument(value: unknown): value is PlatformDocument {
  if (!value || typeof value !== "object") return false;
  const doc = value as Record<string, unknown>;
  return (
    typeof doc.id === "string" &&
    typeof doc.title === "string" &&
    typeof doc.url === "string" &&
    (doc.type === "legislation" || doc.type === "regulations" || doc.type === "reference") &&
    typeof doc.filename === "string"
  );
}

function filenameFromUrl(url: string): string | null {
  if (!url.startsWith("/documents/")) return null;
  const name = url.slice("/documents/".length);
  return name.toLowerCase().endsWith(".pdf") ? decodeURIComponent(name) : null;
}

/** All source PDFs for /sources: built-in list, data/source-documents.json, and files in public/documents. */
export function listPlatformSourceDocuments(): PlatformDocument[] {
  const byFilename = new Map<string, PlatformDocument>();
  const ordered: PlatformDocument[] = [];

  function add(doc: PlatformDocument) {
    const key = doc.filename || filenameFromUrl(doc.url);
    if (!key || byFilename.has(key)) return;
    byFilename.set(key, doc);
    ordered.push(doc);
  }

  for (const doc of PLATFORM_DOCUMENTS) add(doc);
  for (const doc of loadExtraManifest()) add(doc);

  if (fs.existsSync(DOCUMENTS_DIR)) {
    for (const filename of fs
      .readdirSync(DOCUMENTS_DIR)
      .filter((file) => file.toLowerCase().endsWith(".pdf"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
      if (byFilename.has(filename)) continue;
      add({
        id: filename.replace(/\.pdf$/i, ""),
        title: humanizePdfFilename(filename),
        url: `/documents/${encodeURIComponent(filename)}`,
        type: "reference",
        filename,
      });
    }
  }

  return ordered;
}

export function getPlatformDocument(id: string): PlatformDocument | undefined {
  return listPlatformSourceDocuments().find((doc) => doc.id === id) ?? PLATFORM_DOCUMENTS.find((doc) => doc.id === id);
}
