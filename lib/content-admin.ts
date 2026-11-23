import "server-only";

import { FAQ_ITEMS, getFaqBySlug } from "@/lib/content/faqs";
import type { ContentKind, ContentOverride } from "@/lib/content-overrides";
import type { Locale } from "@/lib/i18n/config";
import { localizeWikiPage } from "@/lib/wiki-locale";
import { loadWikiPages } from "@/lib/wiki-server";

export type ContentFields = { title: string; lead?: string; body: string };

/** Languages each kind can be edited in — FAQ pages only render English today. */
export const EDITABLE_LOCALES: Record<ContentKind, Locale[]> = {
  topic: ["en", "sw"],
  faq: ["en"],
};

export function isContentKind(value: string): value is ContentKind {
  return value === "topic" || value === "faq";
}

/** The built-in copy staff edits start from and revert to. */
export function getBaseContent(kind: ContentKind, slug: string, locale: Locale): ContentFields | null {
  if (!EDITABLE_LOCALES[kind].includes(locale)) return null;

  if (kind === "faq") {
    const faq = getFaqBySlug(slug);
    return faq ? { title: faq.question, body: faq.answer } : null;
  }

  const page = loadWikiPages().find((entry) => entry.slug === slug);
  if (!page) return null;
  const localized = localizeWikiPage(page, locale);
  return { title: localized.title, lead: localized.lead || undefined, body: localized.body };
}

export type ContentListItem = {
  kind: ContentKind;
  slug: string;
  title: string;
  category?: string;
  locales: { locale: Locale; edited: boolean; updatedAt?: string; updatedByName?: string }[];
};

export function buildContentList(overrides: ContentOverride[]): ContentListItem[] {
  const byKey = new Map(overrides.map((item) => [`${item.kind}:${item.slug}:${item.locale}`, item]));

  const describe = (kind: ContentKind, slug: string) =>
    EDITABLE_LOCALES[kind].map((locale) => {
      const override = byKey.get(`${kind}:${slug}:${locale}`);
      return {
        locale,
        edited: Boolean(override),
        updatedAt: override?.updatedAt,
        updatedByName: override?.updatedByName,
      };
    });

  const topics: ContentListItem[] = loadWikiPages().map((page) => ({
    kind: "topic",
    slug: page.slug,
    title: byKey.get(`topic:${page.slug}:en`)?.title ?? localizeWikiPage(page, "en").title,
    locales: describe("topic", page.slug),
  }));

  const faqs: ContentListItem[] = FAQ_ITEMS.map((faq) => ({
    kind: "faq",
    slug: faq.slug,
    title: byKey.get(`faq:${faq.slug}:en`)?.title ?? faq.question,
    category: faq.category,
    locales: describe("faq", faq.slug),
  }));

  return [...topics, ...faqs];
}
