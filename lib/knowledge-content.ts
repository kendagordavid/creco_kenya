import "server-only";

import { getCachedWikiPageBySlug, getCachedWikiSummaries } from "@/lib/cached-wiki";
import { FAQ_ITEMS, getFaqBySlug, getFaqsByCategory, type FaqItem } from "@/lib/content/faqs";
import {
  applyFaqOverride,
  applyTopicPageOverride,
  applyTopicSummaryOverride,
  getOverrideMap,
} from "@/lib/content-overrides";
import type { Locale } from "@/lib/i18n/config";
import { localizeWikiPage, localizeWikiSummary, type WikiSummary } from "@/lib/wiki-locale";

/** Knowledge hub content as the public sees it: built-in copy, localised, with staff edits applied. */

export async function getTopicSummaries(locale: Locale): Promise<WikiSummary[]> {
  const [summaries, overrides] = await Promise.all([getCachedWikiSummaries(), getOverrideMap()]);
  return summaries.map((summary) =>
    applyTopicSummaryOverride(localizeWikiSummary(summary, locale), overrides, locale),
  );
}

export async function getTopicPage(slug: string, locale: Locale) {
  const [page, overrides] = await Promise.all([getCachedWikiPageBySlug(slug), getOverrideMap()]);
  if (!page) return null;
  return applyTopicPageOverride(localizeWikiPage(page, locale), overrides, locale);
}

/** FAQ pages are English-only today, so only English FAQ edits are applied. */
export async function getFaqs(category?: string): Promise<FaqItem[]> {
  const overrides = await getOverrideMap();
  const items = category ? getFaqsByCategory(category) : FAQ_ITEMS;
  return items.map((faq) => applyFaqOverride(faq, overrides));
}

export async function getFaq(slug: string): Promise<FaqItem | undefined> {
  const faq = getFaqBySlug(slug);
  if (!faq) return undefined;
  return applyFaqOverride(faq, await getOverrideMap());
}
