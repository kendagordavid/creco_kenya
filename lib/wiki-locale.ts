import { EN_TOPIC_COPY, SW_TOPIC_COPY } from "@/lib/content/topics";
import type { Locale } from "@/lib/i18n/config";
import type { WikiPage } from "@/lib/wiki-server";

export type WikiSummary = {
  slug: string;
  title: string;
  tags: string[];
  related: string[];
};

const SWAHILI_HEADING = /^## Muhtasari kwa Kiswahili\s*$/m;

export function splitWikiBody(body: string): { english: string; swahili: string | null } {
  const index = body.search(SWAHILI_HEADING);
  if (index === -1) {
    return { english: body.trim(), swahili: null };
  }

  const english = body.slice(0, index).trim();
  let swahili = body.slice(index).replace(SWAHILI_HEADING, "").trim();
  swahili = swahili.replace(/^---\s*/m, "").trim();
  swahili = swahili
    .replace(/^\*(?:Source|For full|For the full)[\s\S]*/im, "")
    .trim();

  return { english, swahili: swahili || null };
}

export function localizeWikiSummary(page: WikiSummary, locale: Locale): WikiSummary {
  const copy = locale === "sw" ? SW_TOPIC_COPY[page.slug] : EN_TOPIC_COPY[page.slug];
  if (!copy) return page;
  return {
    ...page,
    title: copy.title,
    tags: copy.tags.length > 0 ? copy.tags : page.tags,
  };
}

export function localizeWikiPage(page: WikiPage, locale: Locale): WikiPage & { englishBody: string } {
  const copy = locale === "sw" ? SW_TOPIC_COPY[page.slug] : EN_TOPIC_COPY[page.slug];
  const { english, swahili } = splitWikiBody(page.body);
  const title = copy?.title ?? page.title;
  const tags = copy?.tags.length ? copy.tags : page.tags;

  if (locale !== "sw") {
    return { ...page, title, tags, body: english || page.body, englishBody: english || page.body };
  }

  const swahiliBody = swahili ? `# ${title}\n\n${swahili}` : `# ${title}\n\n${english || page.body}`;
  return {
    ...page,
    title,
    tags,
    body: swahiliBody,
    englishBody: english || page.body,
  };
}
