import { NextResponse } from "next/server";
import { z } from "zod";
import { EDITABLE_LOCALES, getBaseContent, isContentKind } from "@/lib/content-admin";
import {
  deleteContentOverride,
  listContentOverrides,
  saveContentOverride,
  type ContentKind,
} from "@/lib/content-overrides";
import type { Locale } from "@/lib/i18n/config";
import { requireStaff } from "@/lib/staff-api";

type RouteContext = {
  params: Promise<{ kind: string; slug: string }>;
};

const localeSchema = z.enum(["en", "sw"]);

const saveSchema = z.object({
  locale: localeSchema,
  title: z.string().trim().min(3).max(300),
  lead: z.string().trim().max(1000).nullable().optional(),
  body: z.string().trim().min(20).max(100_000),
});

async function resolve(context: RouteContext) {
  const { kind, slug } = await context.params;
  if (!isContentKind(kind) || !getBaseContent(kind, slug, "en")) return null;
  return { kind, slug };
}

function editable(kind: ContentKind, locale: Locale) {
  return EDITABLE_LOCALES[kind].includes(locale);
}

export async function GET(_request: Request, context: RouteContext) {
  const { response } = await requireStaff();
  if (response) return response;

  const target = await resolve(context);
  if (!target) return NextResponse.json({ error: "Content not found." }, { status: 404 });

  const overrides = (await listContentOverrides()).filter(
    (item) => item.kind === target.kind && item.slug === target.slug,
  );

  return NextResponse.json({
    kind: target.kind,
    slug: target.slug,
    locales: EDITABLE_LOCALES[target.kind].map((locale) => ({
      locale,
      base: getBaseContent(target.kind, target.slug, locale),
      override: overrides.find((item) => item.locale === locale) ?? null,
    })),
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const { session, response } = await requireStaff();
  if (response) return response;

  const target = await resolve(context);
  if (!target) return NextResponse.json({ error: "Content not found." }, { status: 404 });

  const parsed = saveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !editable(target.kind, parsed.data.locale)) {
    return NextResponse.json({ error: "Check the title and body, then try again." }, { status: 400 });
  }

  try {
    await saveContentOverride({
      ...target,
      locale: parsed.data.locale,
      title: parsed.data.title,
      lead: target.kind === "topic" ? parsed.data.lead || null : null,
      body: parsed.data.body,
      userId: session.user.id,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/content] save failed:", error);
    return NextResponse.json({ error: "Could not save this content." }, { status: 500 });
  }
}

/** Reverts one language to the built-in copy. */
export async function DELETE(request: Request, context: RouteContext) {
  const { response } = await requireStaff();
  if (response) return response;

  const target = await resolve(context);
  if (!target) return NextResponse.json({ error: "Content not found." }, { status: 404 });

  const locale = localeSchema.safeParse(new URL(request.url).searchParams.get("locale"));
  if (!locale.success || !editable(target.kind, locale.data)) {
    return NextResponse.json({ error: "Unknown language." }, { status: 400 });
  }

  await deleteContentOverride(target.kind, target.slug, locale.data);
  return NextResponse.json({ ok: true });
}
