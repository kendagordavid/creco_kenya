import { contentTerms } from "./search-terms";

export type RankableWikiPage = {
  slug: string;
  title: string;
  body: string;
  tags: string[];
};

export type RankedWikiPage<T extends RankableWikiPage = RankableWikiPage> = {
  page: T;
  score: number;
};

function haystack(page: RankableWikiPage): string {
  const slugText = page.slug.replace(/-/g, " ");
  return `${page.title} ${page.body} ${page.tags.join(" ")} ${slugText}`.toLowerCase();
}

function applyIntentBoost(question: string, page: RankableWikiPage, score: number): number {
  const q = question.toLowerCase();
  if (/(register|registration|sajili|mahitaji|document)/.test(q) && page.slug.includes("registration")) {
    score += 5;
  }
  if (/(what is|definition|nini|framework)/.test(q) && page.slug === "legal-framework") score += 4;
  if (/(how long|timeline|siku|deadline)/.test(q) && page.slug === "practical-compliance") {
    score += 8;
  }
  if (/(fee|form|\bdays\b)/.test(q) && page.slug === "practical-compliance") {
    score += 4;
  }
  if (/bestow/.test(q) && page.slug === "bestowment") score += 5;
  if (/(tribunal|authority|pbora)/.test(q) && page.slug.includes("authority")) score += 4;
  if (/(suspend|cancel|appeal)/.test(q) && page.slug.includes("suspension")) score += 4;
  return score;
}

/**
 * Rank compiled topics by distinctive words.
 * Terms that show up in every topic (and everyday words like "the" / "who") do not count,
 * so an unrelated question cannot inherit a random page.
 */
export function rankWikiPages<T extends RankableWikiPage>(
  question: string,
  pages: T[],
  limit = 3,
): RankedWikiPage<T>[] {
  const terms = contentTerms(question);
  if (!terms.length || !pages.length) return [];

  const frequency = new Map<string, number>();
  const stacks = pages.map((page) => haystack(page));
  for (const term of terms) {
    let count = 0;
    for (const stack of stacks) {
      if (stack.includes(term)) count += 1;
    }
    frequency.set(term, count);
  }

  const total = pages.length;
  return pages
    .map((page, index) => {
      const stack = stacks[index] ?? "";
      const slugText = page.slug.replace(/-/g, " ");
      const title = page.title.toLowerCase();
      let score = 0;
      for (const term of terms) {
        const seenIn = frequency.get(term) ?? 0;
        if (seenIn === 0 || seenIn >= total) continue;
        if (stack.includes(term)) score += 1;
      }
      if (terms.some((term) => (frequency.get(term) ?? 0) > 0 && (slugText.includes(term) || title.includes(term)))) {
        score += 3;
      }
      score = applyIntentBoost(question, page, score);
      return { page, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Pull the sections that actually mention the question, so the model is not handed the whole topic. */
export function excerptForQuestion(body: string, question: string, maxChars = 1200): string {
  const terms = contentTerms(question);
  const chunks = body
    .split(/\n(?=## )/g)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk && !chunk.startsWith("---"));
  const source = chunks.length > 0 ? chunks : [body.trim()];
  const q = question.toLowerCase();
  const scored = source.map((chunk) => {
    const hay = chunk.toLowerCase();
    let score = terms.reduce((total, term) => total + (hay.includes(term) ? 1 : 0), 0);
    if (/(document|form)/.test(q) && /must accompany|following documents|form 1/.test(hay)) score += 6;
    if (/(how long|timeline|deadline|siku|decide)/.test(q) && /\b\d+\b/.test(chunk) && /day/.test(hay)) {
      score += 6;
    }
    return { chunk, score };
  });
  const picked = new Set<string>();
  let size = 0;
  for (const item of [...scored].sort((a, b) => b.score - a.score)) {
    if (picked.size > 0 && item.score === 0) break;
    if (size > 0 && size + item.chunk.length > maxChars) continue;
    const text = item.chunk.length > maxChars ? item.chunk.slice(0, maxChars) : item.chunk;
    picked.add(text);
    size += text.length;
    if (picked.size >= 2 || size >= maxChars) break;
  }
  const ordered = source.map((chunk) => (chunk.length > maxChars ? chunk.slice(0, maxChars) : chunk)).filter((chunk) => picked.has(chunk));
  const text = ordered.join("\n\n").trim();
  return text || body.slice(0, maxChars);
}
