import { FAQ_ITEMS } from "@/lib/content/faqs";
import { TEMPLATE_ITEMS } from "@/lib/content/templates";
import { TOOLKIT_ITEMS } from "@/lib/content/knowledge";
import { contentTerms } from "@/lib/search-terms";
import { rankWikiPages } from "@/lib/wiki-rank";
import { listWikiPageSummaries, loadWikiPages } from "@/lib/wiki-server";

export type SearchResult = {
  title: string;
  excerpt: string;
  href: string;
  type: "topic" | "faq" | "template" | "toolkit" | "page";
};

export function globalSearch(query: string, limit = 20): SearchResult[] {
  const terms = contentTerms(query);
  if (!terms.length) return [];

  const scored: { result: SearchResult; score: number }[] = [];

  function consider(haystack: string, result: SearchResult) {
    const hay = haystack.toLowerCase();
    const score = terms.filter((term) => hay.includes(term)).length;
    if (score > 0) scored.push({ result, score });
  }

  for (const entry of rankWikiPages(query, loadWikiPages(), 8)) {
    scored.push({
      score: entry.score,
      result: {
        title: entry.page.title,
        excerpt: entry.page.body.slice(0, 160).replace(/\n/g, " "),
        href: `/knowledge/topics/${entry.page.slug}`,
        type: "topic",
      },
    });
  }

  for (const faq of FAQ_ITEMS) {
    consider(`${faq.question} ${faq.answer}`, {
      title: faq.question,
      excerpt: faq.answer.slice(0, 160),
      href: `/knowledge/faq/${faq.slug}`,
      type: "faq",
    });
  }

  for (const template of TEMPLATE_ITEMS) {
    consider(`${template.title} ${template.summary} ${template.body}`, {
      title: template.title,
      excerpt: template.summary,
      href: `/compliance/templates/${template.slug}`,
      type: "template",
    });
  }

  for (const toolkit of TOOLKIT_ITEMS) {
    consider(`${toolkit.title} ${toolkit.summary} ${toolkit.sections.join(" ")}`, {
      title: toolkit.title,
      excerpt: toolkit.summary,
      href: `/knowledge/toolkits/${toolkit.slug}`,
      type: "toolkit",
    });
  }

  const staticPages = [
    { title: "PBO Guidance", href: "/guidance", keywords: "ask question guidance q&a" },
    { title: "Compliance tools", href: "/compliance", keywords: "checklist assessment templates" },
    { title: "Monitoring reports", href: "/monitoring", keywords: "civic space incident registration barriers" },
    { title: "Report anonymously", href: "/report", keywords: "anonymous report issue website problem feedback" },
    { title: "Knowledge hub", href: "/knowledge", keywords: "learn faq topics media" },
    { title: "Source documents", href: "/sources", keywords: "pdf act legal sources" },
  ];

  for (const page of staticPages) {
    consider(`${page.title} ${page.keywords}`, {
      title: page.title,
      excerpt: page.keywords,
      href: page.href,
      type: "page",
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const entry of scored) {
    if (seen.has(entry.result.href)) continue;
    seen.add(entry.result.href);
    results.push(entry.result);
    if (results.length >= limit) break;
  }
  return results;
}

export function listTopicSummaries() {
  return listWikiPageSummaries();
}
