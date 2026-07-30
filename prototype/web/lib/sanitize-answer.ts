import { loadWikiPages } from "./wiki-server";

const WIKI_MARKER = /\[Wiki:\s*[^\]]+\]/gi;
const WIKI_SOURCE_LINE = /^\*?\s*Source:\s*\[Wiki:[^\]]+\]\s*\*?\s*$/gim;
const WIKI_LINK = /\[\[([^\]]+)\]\]/g;

function slugToTitle(slug: string): string {
  const page = loadWikiPages().find((p) => p.slug === slug);
  if (page) return page.title;
  return slug.replace(/-/g, " ");
}

/** Remove internal wiki markers and convert wiki-style links to plain titles. */
export function sanitizeUserFacingAnswer(answer: string): string {
  return answer
    .replace(WIKI_SOURCE_LINE, "")
    .replace(WIKI_MARKER, "")
    .replace(WIKI_LINK, (_, slug: string) => slugToTitle(slug.trim()))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
