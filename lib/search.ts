import { FAQ_ITEMS } from "@/lib/content/faqs";
import { TEMPLATE_ITEMS } from "@/lib/content/templates";
import { TOOLKIT_ITEMS } from "@/lib/content/knowledge";
import { listWikiPageSummaries, loadWikiPages } from "@/lib/wiki-server";

export type SearchResult = {
  title: string;
  excerpt: string;
  href: string;
  type: "topic" | "faq" | "template" | "toolkit" | "page";
};

export function globalSearch(query: string, limit = 20): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.match(/\w{2,}/g) ?? [];
  const results: SearchResult[] = [];

  for (const page of loadWikiPages()) {
    const haystack = `${page.title} ${page.body} ${page.tags.join(" ")}`.toLowerCase();
    const score = terms.filter((t) => haystack.includes(t)).length;
    if (score > 0) {
      results.push({
        title: page.title,
        excerpt: page.body.slice(0, 160).replace(/\n/g, " "),
        href: `/knowledge/topics/${page.slug}`,
        type: "topic",
      });
    }
  }

  for (const faq of FAQ_ITEMS) {
    const haystack = `${faq.question} ${faq.answer}`.toLowerCase();
    if (terms.some((t) => haystack.includes(t))) {
      results.push({
        title: faq.question,
        excerpt: faq.answer.slice(0, 160),
        href: `/knowledge/faq/${faq.slug}`,
        type: "faq",
      });
    }
  }

  for (const template of TEMPLATE_ITEMS) {
    const haystack = `${template.title} ${template.summary} ${template.body}`.toLowerCase();
    if (terms.some((t) => haystack.includes(t))) {
      results.push({
        title: template.title,
        excerpt: template.summary,
        href: `/compliance/templates/${template.slug}`,
        type: "template",
      });
    }
  }

  for (const toolkit of TOOLKIT_ITEMS) {
    const haystack = `${toolkit.title} ${toolkit.summary} ${toolkit.sections.join(" ")}`.toLowerCase();
    if (terms.some((t) => haystack.includes(t))) {
      results.push({
        title: toolkit.title,
        excerpt: toolkit.summary,
        href: `/knowledge/toolkits/${toolkit.slug}`,
        type: "toolkit",
      });
    }
  }

  const staticPages = [
    { title: "PBO Guidance", href: "/guidance", keywords: "ask question guidance q&a" },
    { title: "Compliance tools", href: "/compliance", keywords: "checklist assessment templates" },
    { title: "Monitoring reports", href: "/monitoring", keywords: "civic space incident registration barriers" },
    { title: "Knowledge hub", href: "/knowledge", keywords: "learn faq topics media" },
    { title: "Source documents", href: "/sources", keywords: "pdf act legal sources" },
  ];

  for (const page of staticPages) {
    if (terms.some((t) => `${page.title} ${page.keywords}`.toLowerCase().includes(t))) {
      results.push({
        title: page.title,
        excerpt: page.keywords,
        href: page.href,
        type: "page",
      });
    }
  }

  // Dedupe by href
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.href)) return false;
    seen.add(r.href);
    return true;
  }).slice(0, limit);
}

export function listTopicSummaries() {
  return listWikiPageSummaries();
}
