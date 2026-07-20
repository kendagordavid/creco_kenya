import fs from "fs";
import path from "path";

export type SourceDocument = {
  id: string;
  title: string;
  url: string;
};

export type WikiPage = {
  slug: string;
  title: string;
  body: string;
  tags: string[];
  related: string[];
  sourceDocuments: SourceDocument[];
};

const WIKI_TOPIC_CANDIDATES = [
  path.join(process.cwd(), "prototype", "wiki", "topics"),
  path.join(process.cwd(), "..", "wiki", "topics"),
];

function resolveWikiTopicsDir(): string {
  for (const dir of WIKI_TOPIC_CANDIDATES) {
    if (fs.existsSync(dir)) return dir;
  }
  return WIKI_TOPIC_CANDIDATES[0];
}

function parseFrontmatter(text: string): { meta: Record<string, string | string[]>; body: string } {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };

  const meta: Record<string, string | string[]> = {};
  for (const line of match[1].split("\n")) {
    if (!line || line.startsWith(" ") || line.startsWith("\t")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      meta[key] = value.replace(/^"|"$/g, "");
    }
  }
  return { meta, body: match[2].trim() };
}

function extractSourceDocuments(raw: string): SourceDocument[] {
  const docs: SourceDocument[] = [];
  const block = raw.match(/source_documents:([\s\S]*?)(?:\n---|\nslug:)/);
  if (!block) return docs;

  let current: Partial<SourceDocument> = {};
  for (const line of block[1].split("\n")) {
    if (line.trim().startsWith("- id:")) {
      if (current.id) docs.push(current as SourceDocument);
      current = { id: line.split(":").slice(1).join(":").trim() };
    } else if (line.includes("title:")) {
      current.title = line.split(":").slice(1).join(":").trim();
    } else if (line.includes("url:")) {
      current.url = line.split(":").slice(1).join(":").trim();
    }
  }
  if (current.id && current.title && current.url) docs.push(current as SourceDocument);
  return docs;
}

export function loadWikiPages(): WikiPage[] {
  const wikiDir = resolveWikiTopicsDir();
  if (!fs.existsSync(wikiDir)) return [];

  return fs
    .readdirSync(wikiDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(wikiDir, file), "utf-8");
      const { meta, body } = parseFrontmatter(raw);
      const tags = meta.tags;
      const related = meta.related;
      return {
        slug: (meta.slug as string) || file.replace(/\.md$/, ""),
        title: (meta.title as string) || file.replace(/\.md$/, ""),
        body,
        tags: Array.isArray(tags) ? tags : [],
        related: Array.isArray(related) ? related : [],
        sourceDocuments: extractSourceDocuments(raw),
      };
    });
}

function firstParagraph(body: string): string {
  for (const block of body.split("\n\n")) {
    const cleaned = block.trim();
    if (cleaned && !cleaned.startsWith("#")) return cleaned.slice(0, 400);
  }
  return body.slice(0, 400);
}

function extractAnswerBody(body: string, maxChars = 1800): string {
  const lines: string[] = [];
  for (const block of body.split("\n\n")) {
    const b = block.trim();
    if (!b || b.startsWith("#")) continue;
    if (b.startsWith("## ")) {
      lines.push(`\n**${b.slice(3).trim()}**`);
      continue;
    }
    if (b.startsWith("- ") || b.startsWith("1.")) {
      for (const item of b.split("\n")) {
        const t = item.trim();
        if (t.startsWith("- ")) lines.push(`• ${t.slice(2)}`);
        else if (/^\d+\./.test(t)) lines.push(`• ${t.replace(/^\d+\.\s*/, "")}`);
      }
      continue;
    }
    lines.push(b);
    if (lines.join("\n").length > maxChars) break;
  }
  let text = lines.join("\n").trim();
  if (text.length > maxChars) text = `${text.slice(0, maxChars - 1)}…`;
  return text || firstParagraph(body);
}

export function searchWiki(question: string, limit = 3): WikiPage[] {
  const pages = loadWikiPages();
  const terms = question.toLowerCase().match(/\w{3,}/g) ?? [];
  if (!terms.length) return [];

  const q = question.toLowerCase();
  const scored = pages
    .map((page) => {
      const slugText = page.slug.replace(/-/g, " ");
      const haystack = `${page.title} ${page.body} ${page.tags.join(" ")} ${slugText}`.toLowerCase();
      let score = terms.filter((t) => haystack.includes(t)).length;
      if (terms.some((t) => slugText.includes(t) || page.title.toLowerCase().includes(t)))
        score += 3;
      if (/(register|registration|sajili|mahitaji|document)/.test(q) && page.slug.includes("registration"))
        score += 5;
      if (/(what is|definition|nini|pbo)/.test(q) && page.slug.includes("what-is")) score += 3;
      if (/(how long|timeline|days|siku)/.test(q) && /timeline|process/.test(page.slug)) score += 5;
      return { page, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.page);

  return scored;
}

export function composeAnswer(pages: WikiPage[]): string {
  const primary = pages[0];
  const body = extractAnswerBody(primary.body);
  const related = primary.related.slice(0, 3).map((s) => `[[${s}]]`).join(", ");
  let answer = `Based on the compiled topic **${primary.title}**:\n\n${body}\n\n*Source: [Wiki: ${primary.slug}]*`;
  if (pages.length > 1) {
    answer += `\n\n*Also see:* ${pages.slice(1, 3).map((p) => p.title).join(", ")}`;
  }
  if (related) answer += `\n\n*Related topics:* ${related}`;
  answer += "\n\n*This is informational guidance, not legal advice.*";
  return answer;
}

export function askQuestionWiki(question: string) {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      answer: "Please enter a question about the PBO Act.",
      citations: [],
      confidence: "low" as const,
      refused: true,
    };
  }

  const pages = searchWiki(trimmed);
  if (!pages.length) {
    return {
      answer:
        "I couldn't find a matching topic in the compiled PBO Act wiki for that question. Please try rephrasing, browse the topics page, or contact CRECO Kenya for guidance.",
      citations: [],
      confidence: "low" as const,
      refused: true,
    };
  }

  const citations = pages.map((page, i) => {
    const src = page.sourceDocuments[0];
    return {
      index: i + 1,
      wiki_slug: page.slug,
      wiki_title: page.title,
      excerpt: firstParagraph(page.body),
      relevance: Math.round(Math.max(0.5, 1 - i * 0.12) * 1000) / 1000,
      source_id: src?.id ?? page.slug,
      source_title: src?.title ?? page.title,
      source_url: src?.url ?? "",
      source_type: "wiki",
    };
  });

  return {
    answer: composeAnswer(pages),
    citations,
    confidence: (pages.length >= 2 ? "high" : "medium") as "high" | "medium",
    refused: false,
  };
}

export function listSourceDocuments() {
  const seen = new Map<string, { id: string; title: string; url: string; type: string }>();
  for (const page of loadWikiPages()) {
    for (const doc of page.sourceDocuments) {
      if (!seen.has(doc.id)) {
        seen.set(doc.id, { id: doc.id, title: doc.title, url: doc.url, type: "source" });
      }
    }
  }
  return [...seen.values()];
}

export function listWikiPageSummaries() {
  return loadWikiPages().map((p) => ({
    slug: p.slug,
    title: p.title,
    tags: p.tags,
    related: p.related,
  }));
}
