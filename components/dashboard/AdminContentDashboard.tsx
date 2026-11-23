"use client";

import { useMemo, useRef, useState } from "react";
import { BookOpen, Eye, HelpCircle, Loader2, PenLine, RotateCcw, Save, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { WikiBody } from "@/components/WikiBody";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { authFetch, invalidateAuthCache, peekCachedJson } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

type Kind = "topic" | "faq";
type Locale = "en" | "sw";

type ListItem = {
  kind: Kind;
  slug: string;
  title: string;
  category?: string;
  locales: { locale: Locale; edited: boolean; updatedAt?: string; updatedByName?: string }[];
};

type Fields = { title: string; lead?: string; body: string };

type Detail = {
  kind: Kind;
  slug: string;
  locales: {
    locale: Locale;
    base: Fields | null;
    override: (Fields & { updatedAt: string; updatedByName?: string }) | null;
  }[];
};

const LIST_API = "/api/admin/content";

function emptyDraft(): Fields {
  return { title: "", lead: "", body: "" };
}

function sameDraft(a: Fields, b: Fields) {
  return a.title === b.title && (a.lead ?? "") === (b.lead ?? "") && a.body === b.body;
}

export function AdminContentDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const cached = peekCachedJson<{ items?: ListItem[]; error?: string }>(LIST_API);
  const { data, loading, error: queryError } = useAuthQuery<{ items?: ListItem[]; error?: string }>(LIST_API, {
    ttlMs: CACHE_TTL.admin,
  });
  const [items, setItems] = useState<ListItem[]>(() => (cached?.error ? [] : (cached?.items ?? [])));
  const [tab, setTab] = useState<Kind>("topic");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{ kind: Kind; slug: string } | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const [draft, setDraft] = useState<Fields>(emptyDraft);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const error = queryError ?? data?.error ?? "";

  const [syncedData, setSyncedData] = useState(data);
  if (data !== syncedData) {
    setSyncedData(data);
    if (data && !data.error) setItems(data.items ?? []);
  }

  const current = detail?.locales.find((entry) => entry.locale === locale) ?? null;
  const published: Fields = current?.override ?? current?.base ?? emptyDraft();
  const dirty = Boolean(current) && !sameDraft(draft, published);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter(
      (item) => item.kind === tab && (!needle || item.title.toLowerCase().includes(needle) || item.slug.includes(needle)),
    );
  }, [items, tab, query]);

  function loadDraft(next: Detail, nextLocale: Locale) {
    const entry = next.locales.find((item) => item.locale === nextLocale) ?? next.locales[0];
    const fields = entry?.override ?? entry?.base ?? emptyDraft();
    setLocale(entry?.locale ?? "en");
    setDraft({ title: fields.title, lead: fields.lead ?? "", body: fields.body });
    setPreview(false);
  }

  async function fetchDetail(kind: Kind, slug: string, nextLocale: Locale) {
    setDetailLoading(true);
    try {
      const response = await authFetch(`${LIST_API}/${kind}/${encodeURIComponent(slug)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setDetail(payload as Detail);
      loadDraft(payload as Detail, nextLocale);
    } catch {
      setNotice({ tone: "error", text: t.adminContent.loadFailed });
    } finally {
      setDetailLoading(false);
    }
  }

  function confirmDiscard() {
    return !dirty || window.confirm(t.adminContent.discardConfirm);
  }

  function selectItem(item: ListItem) {
    if (!confirmDiscard()) return;
    setNotice(null);
    setSelected({ kind: item.kind, slug: item.slug });
    void fetchDetail(item.kind, item.slug, "en");
    // Below the xl breakpoint the editor sits under the list, so bring it into view.
    const editor = editorRef.current;
    if (editor && editor.getBoundingClientRect().top > window.innerHeight / 2) {
      editor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function switchLocale(next: Locale) {
    if (!detail || next === locale || !confirmDiscard()) return;
    setNotice(null);
    loadDraft(detail, next);
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setNotice(null);
    try {
      const response = await authFetch(`${LIST_API}/${selected.kind}/${encodeURIComponent(selected.slug)}`, {
        method: "PUT",
        body: JSON.stringify({
          locale,
          title: draft.title,
          lead: selected.kind === "topic" ? draft.lead || null : null,
          body: draft.body,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      invalidateAuthCache(LIST_API);
      await refreshAfterWrite(selected);
      setNotice({ tone: "ok", text: t.adminContent.saved });
    } catch (err) {
      setNotice({ tone: "error", text: err instanceof Error && err.message ? err.message : t.adminContent.saveFailed });
    } finally {
      setSaving(false);
    }
  }

  async function revert() {
    if (!selected || !window.confirm(t.adminContent.revertConfirm)) return;
    setSaving(true);
    setNotice(null);
    try {
      const response = await authFetch(
        `${LIST_API}/${selected.kind}/${encodeURIComponent(selected.slug)}?locale=${locale}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error();
      invalidateAuthCache(LIST_API);
      await refreshAfterWrite(selected);
      setNotice({ tone: "ok", text: t.adminContent.reverted });
    } catch {
      setNotice({ tone: "error", text: t.adminContent.saveFailed });
    } finally {
      setSaving(false);
    }
  }

  async function refreshAfterWrite(target: { kind: Kind; slug: string }) {
    const [listResponse] = await Promise.all([
      authFetch(LIST_API),
      fetchDetail(target.kind, target.slug, locale),
    ]);
    const listPayload = await listResponse.json();
    if (listResponse.ok) setItems(listPayload.items ?? []);
  }

  const publicHref = selected
    ? selected.kind === "topic"
      ? `/knowledge/topics/${selected.slug}`
      : `/knowledge/faq/${selected.slug}`
    : "#";

  return (
    <AdminShell title={t.adminContent.title} description={t.adminContent.description}>
      {loading && !data ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.adminContent.loading}
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="space-y-3">
            <div role="tablist" aria-label={t.adminContent.kindLabel} className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              {(["topic", "faq"] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  role="tab"
                  aria-selected={tab === kind}
                  onClick={() => setTab(kind)}
                  className={cn(
                    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md text-sm font-semibold",
                    tab === kind ? "bg-background text-creco-primary shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {kind === "topic" ? <BookOpen className="size-4" aria-hidden /> : <HelpCircle className="size-4" aria-hidden />}
                  {kind === "topic" ? t.adminContent.topics : t.adminContent.faqs}
                </button>
              ))}
            </div>
            <label className="relative block">
              <span className="sr-only">{t.adminContent.searchLabel}</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.adminContent.searchPlaceholder}
                className="h-11 w-full rounded-lg border border-creco-border bg-background pl-9 pr-3 text-sm"
              />
            </label>
            <ul className="max-h-[32rem] space-y-1 overflow-y-auto rounded-lg border border-creco-border bg-card p-1 xl:max-h-[70vh]">
              {visible.map((item) => {
                const active = selected?.kind === item.kind && selected.slug === item.slug;
                const edited = item.locales.filter((entry) => entry.edited).map((entry) => entry.locale.toUpperCase());
                return (
                  <li key={`${item.kind}:${item.slug}`}>
                    <button
                      type="button"
                      onClick={() => selectItem(item)}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "w-full rounded-md px-3 py-2.5 text-left text-sm",
                        active ? "bg-creco-green-muted text-creco-primary" : "hover:bg-muted",
                      )}
                    >
                      <span className="line-clamp-2 font-medium">{item.title}</span>
                      {edited.length > 0 && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-creco-orange-dark">
                          <PenLine className="size-3" aria-hidden />
                          {format(t.adminContent.editedIn, { languages: edited.join(", ") })}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div ref={editorRef} className="min-w-0 scroll-mt-24">
            {!selected ? (
              <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardContent className="flex flex-col items-center px-6 py-16 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-creco-green-muted text-creco-primary">
                    <PenLine className="size-7" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-creco-primary">{t.adminContent.pickTitle}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{t.adminContent.pickLead}</p>
                </CardContent>
              </Card>
            ) : detailLoading && !detail ? (
              <div className="flex items-center gap-2 py-16 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" aria-hidden />
                {t.adminContent.loading}
              </div>
            ) : current ? (
              <Card className="border-0 shadow-sm ring-1 ring-black/5">
                <CardContent className="space-y-5 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {detail && detail.locales.length > 1 ? (
                      <div role="tablist" aria-label={t.adminContent.languageLabel} className="inline-flex gap-1 rounded-lg bg-muted p-1">
                        {detail.locales.map((entry) => (
                          <button
                            key={entry.locale}
                            type="button"
                            role="tab"
                            aria-selected={locale === entry.locale}
                            onClick={() => switchLocale(entry.locale)}
                            className={cn(
                              "min-h-10 rounded-md px-4 text-sm font-semibold",
                              locale === entry.locale ? "bg-background text-creco-primary shadow-sm" : "text-muted-foreground",
                            )}
                          >
                            {entry.locale === "en" ? "English" : "Kiswahili"}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground">{t.adminContent.englishOnly}</p>
                    )}
                    <a
                      href={publicHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-creco-primary no-underline hover:underline"
                    >
                      {t.adminContent.viewOnSite}
                    </a>
                  </div>

                  <p className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                    {current.override
                      ? format(t.adminContent.editedBy, {
                          name: current.override.updatedByName ?? t.adminConsole.staff,
                          date: new Date(current.override.updatedAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }),
                        })
                      : t.adminContent.builtIn}
                  </p>

                  {notice && (
                    <p
                      role="status"
                      className={
                        notice.tone === "ok"
                          ? "rounded-lg border border-creco-primary/20 bg-creco-green-muted px-4 py-3 text-sm text-creco-primary"
                          : "rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                      }
                    >
                      {notice.text}
                    </p>
                  )}

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-creco-primary">
                      {selected.kind === "faq" ? t.adminContent.question : t.adminContent.titleLabel}
                    </span>
                    <input
                      value={draft.title}
                      onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value }))}
                      className="h-11 w-full rounded-lg border border-creco-border bg-background px-3 text-sm"
                    />
                  </label>

                  {selected.kind === "topic" && (
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-creco-primary">{t.adminContent.leadLabel}</span>
                      <textarea
                        value={draft.lead ?? ""}
                        rows={2}
                        onChange={(event) => setDraft((value) => ({ ...value, lead: event.target.value }))}
                        className="w-full resize-y rounded-lg border border-creco-border bg-background px-3 py-2 text-sm leading-relaxed"
                      />
                      <span className="block text-xs text-muted-foreground">{t.adminContent.leadHint}</span>
                    </label>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-creco-primary">
                        {selected.kind === "faq" ? t.adminContent.answer : t.adminContent.bodyLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreview((value) => !value)}
                        aria-pressed={preview}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-creco-border px-3 text-xs font-semibold text-creco-primary"
                      >
                        {preview ? <PenLine className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}
                        {preview ? t.adminContent.edit : t.adminContent.preview}
                      </button>
                    </div>
                    {preview ? (
                      <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-creco-border bg-background p-5">
                        <WikiBody body={draft.body} />
                      </div>
                    ) : (
                      <textarea
                        value={draft.body}
                        rows={22}
                        spellCheck
                        onChange={(event) => setDraft((value) => ({ ...value, body: event.target.value }))}
                        className="w-full resize-y rounded-lg border border-creco-border bg-background px-3 py-2 font-mono text-[0.8rem] leading-relaxed"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">{t.adminContent.markdownHint}</p>
                  </div>

                  <div className="flex flex-col-reverse gap-2 border-t border-creco-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {current.override && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={revert}
                          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-creco-border bg-background px-3 text-sm font-semibold disabled:opacity-60"
                        >
                          <RotateCcw className="size-4" aria-hidden />
                          {t.adminContent.revert}
                        </button>
                      )}
                      {dirty && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => setDraft({ title: published.title, lead: published.lead ?? "", body: published.body })}
                          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground disabled:opacity-60"
                        >
                          {t.adminContent.discard}
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={saving || !dirty}
                      onClick={save}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-creco-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
                      {saving ? t.adminContent.saving : t.adminContent.publish}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
