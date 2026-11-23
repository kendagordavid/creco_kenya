import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import type { FaqItem } from "@/lib/content/faqs";
import { getSql } from "@/lib/db";
import type { Locale } from "@/lib/i18n/config";
import { ensureStaffSchema } from "@/lib/staff-store";
import type { WikiSummary } from "@/lib/wiki-locale";

/*
 * Staff edits to knowledge content. The built-in copy (wiki markdown, lib/content)
 * stays the default; a row in content_overrides replaces one topic or FAQ in one
 * language until staff revert it. Kept in the database because the deployed file
 * system is read-only.
 */

export type ContentKind = "topic" | "faq";

export type ContentOverride = {
  kind: ContentKind;
  slug: string;
  locale: Locale;
  title: string;
  lead?: string;
  body: string;
  updatedAt: string;
  updatedByName?: string;
};

type OverrideRow = {
  kind: ContentKind;
  slug: string;
  locale: Locale;
  title: string;
  lead: string | null;
  body: string;
  updated_at: Date;
  updated_by_name: string | null;
};

const CONTENT_TAG = "content-overrides";

function overrideKey(kind: ContentKind, slug: string, locale: Locale) {
  return `${kind}:${slug}:${locale}`;
}

async function selectOverrides(): Promise<ContentOverride[]> {
  await ensureStaffSchema();
  const sql = getSql();
  const rows = await sql<OverrideRow[]>`
    SELECT o.kind, o.slug, o.locale, o.title, o.lead, o.body, o.updated_at, u.name AS updated_by_name
    FROM content_overrides o
    LEFT JOIN users u ON u.id = o.updated_by
  `;
  return rows.map((row) => ({
    kind: row.kind,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    lead: row.lead ?? undefined,
    body: row.body,
    updatedAt: row.updated_at.toISOString(),
    updatedByName: row.updated_by_name ?? undefined,
  }));
}

export function listContentOverrides(): Promise<ContentOverride[]> {
  return selectOverrides();
}

const cachedOverrides = unstable_cache(selectOverrides, ["content-overrides-v1"], {
  revalidate: 60 * 60,
  tags: [CONTENT_TAG],
});

export type OverrideMap = Map<string, ContentOverride>;

/**
 * Overrides for public pages. Falls back to no overrides when the database is
 * unavailable so knowledge pages keep rendering the built-in copy.
 */
export async function getOverrideMap(): Promise<OverrideMap> {
  try {
    const overrides = await cachedOverrides();
    return new Map(overrides.map((item) => [overrideKey(item.kind, item.slug, item.locale), item]));
  } catch (error) {
    console.error("[content] could not load overrides:", error);
    return new Map();
  }
}

export function findOverride(
  map: OverrideMap,
  kind: ContentKind,
  slug: string,
  locale: Locale,
): ContentOverride | undefined {
  return map.get(overrideKey(kind, slug, locale));
}

export async function saveContentOverride(input: {
  kind: ContentKind;
  slug: string;
  locale: Locale;
  title: string;
  lead?: string | null;
  body: string;
  userId: string;
}): Promise<void> {
  await ensureStaffSchema();
  const sql = getSql();
  await sql`
    INSERT INTO content_overrides (kind, slug, locale, title, lead, body, updated_by, updated_at)
    VALUES (${input.kind}, ${input.slug}, ${input.locale}, ${input.title}, ${input.lead ?? null},
            ${input.body}, ${input.userId}, NOW())
    ON CONFLICT (kind, slug, locale) DO UPDATE SET
      title = EXCLUDED.title,
      lead = EXCLUDED.lead,
      body = EXCLUDED.body,
      updated_by = EXCLUDED.updated_by,
      updated_at = NOW()
  `;
  expireContentCache();
}

export async function deleteContentOverride(kind: ContentKind, slug: string, locale: Locale): Promise<boolean> {
  await ensureStaffSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM content_overrides
    WHERE kind = ${kind} AND slug = ${slug} AND locale = ${locale}
    RETURNING slug
  `;
  expireContentCache();
  return rows.length > 0;
}

function expireContentCache() {
  // Expire now rather than serve stale-while-revalidate, so editors see their change on reload.
  revalidateTag(CONTENT_TAG, { expire: 0 });
}

/* ------------------------------------------------------------------ */
/* Applying overrides on public pages                                  */
/* ------------------------------------------------------------------ */

export function applyTopicSummaryOverride(
  summary: WikiSummary,
  map: OverrideMap,
  locale: Locale,
): WikiSummary {
  const override = findOverride(map, "topic", summary.slug, locale);
  if (!override) return summary;
  return { ...summary, title: override.title, lead: override.lead ?? summary.lead };
}

export function applyTopicPageOverride<
  T extends { slug: string; title: string; lead: string; body: string; englishBody: string },
>(page: T, map: OverrideMap, locale: Locale): T {
  const own = findOverride(map, "topic", page.slug, locale);
  const english = findOverride(map, "topic", page.slug, "en");
  return {
    ...page,
    title: own?.title ?? page.title,
    lead: own?.lead ?? page.lead,
    body: own?.body ?? page.body,
    englishBody: english?.body ?? page.englishBody,
  };
}

export function applyFaqOverride(faq: FaqItem, map: OverrideMap, locale: Locale = "en"): FaqItem {
  const override = findOverride(map, "faq", faq.slug, locale);
  if (!override) return faq;
  return { ...faq, question: override.title, answer: override.body };
}
