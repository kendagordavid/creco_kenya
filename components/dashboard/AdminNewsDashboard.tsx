"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Newspaper, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { FormField, FormSelect, FormTextarea } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { authFetch, invalidateAuthCache, peekCachedJson } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";
import { useCurrentLocale, useTranslations } from "@/lib/i18n/client";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/news";
import {
  formatNewsDate,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "@/lib/news-format";

type NewsPostRow = {
  id: string;
  category: NewsCategory;
  published: boolean;
  publishedAt: string;
  titleEn: string;
  summaryEn: string;
  bodyEn: string;
  titleSw?: string;
  summarySw?: string;
  bodySw?: string;
  hasImage: boolean;
};

type Draft = {
  category: NewsCategory;
  published: boolean;
  publishedAtLocal: string;
  titleEn: string;
  summaryEn: string;
  bodyEn: string;
  titleSw: string;
  summarySw: string;
  bodySw: string;
  removeImage: boolean;
};

function emptyDraft(): Draft {
  return {
    category: "legislative",
    published: false,
    publishedAtLocal: toDatetimeLocalValue(new Date().toISOString()),
    titleEn: "",
    summaryEn: "",
    bodyEn: "",
    titleSw: "",
    summarySw: "",
    bodySw: "",
    removeImage: false,
  };
}

function draftFromPost(post: NewsPostRow): Draft {
  return {
    category: post.category,
    published: post.published,
    publishedAtLocal: toDatetimeLocalValue(post.publishedAt),
    titleEn: post.titleEn,
    summaryEn: post.summaryEn,
    bodyEn: post.bodyEn,
    titleSw: post.titleSw ?? "",
    summarySw: post.summarySw ?? "",
    bodySw: post.bodySw ?? "",
    removeImage: false,
  };
}

export function AdminNewsDashboard() {
  const t = useTranslations();
  const locale = useCurrentLocale();
  const cached = peekCachedJson<{ posts?: NewsPostRow[]; error?: string }>("/api/admin/news");
  const { data, loading, error: queryError } = useAuthQuery<{ posts?: NewsPostRow[]; error?: string }>(
    "/api/admin/news",
    { ttlMs: CACHE_TTL.admin },
  );

  const [posts, setPosts] = useState<NewsPostRow[]>(() => (cached?.error ? [] : (cached?.posts ?? [])));
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const queryLoadError = queryError ?? data?.error ?? "";

  useEffect(() => {
    if (data && !data.error) {
      setPosts(data.posts ?? []);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [posts],
  );

  function startCreate() {
    setEditingId("new");
    setDraft(emptyDraft());
    setPhotoFile(null);
    setPhotoPreview(null);
    setNotice("");
    setError("");
  }

  function startEdit(post: NewsPostRow) {
    setEditingId(post.id);
    setDraft(draftFromPost(post));
    setPhotoFile(null);
    setPhotoPreview(post.hasImage ? `/api/admin/news/${post.id}/image` : null);
    setNotice("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft());
    setPhotoFile(null);
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setError("");
  }

  function onPhotoChange(file: File | null) {
    setPhotoFile(file);
    setDraft((d) => ({ ...d, removeImage: false }));
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else if (editingId && editingId !== "new") {
      const post = posts.find((p) => p.id === editingId);
      setPhotoPreview(post?.hasImage ? `/api/admin/news/${editingId}/image` : null);
    } else {
      setPhotoPreview(null);
    }
  }

  function removePhoto() {
    setPhotoFile(null);
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setDraft((d) => ({ ...d, removeImage: true }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    const payload = {
      category: draft.category,
      published: draft.published,
      publishedAt: fromDatetimeLocalValue(draft.publishedAtLocal),
      titleEn: draft.titleEn,
      summaryEn: draft.summaryEn,
      bodyEn: draft.bodyEn,
      titleSw: draft.titleSw || undefined,
      summarySw: draft.summarySw || undefined,
      bodySw: draft.bodySw || undefined,
      removeImage: draft.removeImage,
    };

    const form = new FormData();
    form.set("payload", JSON.stringify(payload));
    if (photoFile) {
      form.set("image", photoFile);
    }

    const url =
      editingId && editingId !== "new" ? `/api/admin/news/${editingId}` : "/api/admin/news";
    const method = editingId && editingId !== "new" ? "PATCH" : "POST";

    try {
      const response = await authFetch(url, { method, body: form });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error ?? t.adminNews.saveFailed);
      }
      invalidateAuthCache("/api/admin/news");
      const saved = body.post as NewsPostRow;
      setPosts((prev) => {
        const next = prev.filter((p) => p.id !== saved.id);
        next.unshift(saved);
        return next;
      });
      setEditingId(saved.id);
      setDraft(draftFromPost(saved));
      setPhotoFile(null);
      setDraft((d) => ({ ...d, removeImage: false }));
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview(saved.hasImage ? `/api/admin/news/${saved.id}/image?t=${Date.now()}` : null);
      setNotice(t.adminNews.saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.adminNews.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingId || editingId === "new") return;
    if (!window.confirm(t.adminNews.deleteConfirm)) return;

    setDeleting(true);
    setNotice("");
    setError("");
    try {
      const response = await authFetch(`/api/admin/news/${editingId}`, { method: "DELETE" });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error ?? t.adminNews.deleteFailed);
      }
      invalidateAuthCache("/api/admin/news");
      setPosts((prev) => prev.filter((p) => p.id !== editingId));
      cancelEdit();
      setNotice(t.adminNews.deleted);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.adminNews.deleteFailed);
    } finally {
      setDeleting(false);
    }
  }

  const showForm = editingId !== null;

  return (
    <AdminShell
      title={t.adminNews.title}
      description={t.adminNews.description}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Card className="creco-card border-creco-primary/10">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{t.adminNews.listTitle}</CardTitle>
              <CardDescription>
                {loading && !posts.length ? t.adminNews.loading : `${sortedPosts.length} item(s)`}
              </CardDescription>
            </div>
            <Button type="button" size="sm" onClick={startCreate} className="gap-1.5">
              <Plus className="size-4" aria-hidden />
              {t.adminNews.create}
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {queryLoadError && (
              <p className="text-sm text-destructive" role="alert">
                {queryLoadError}
              </p>
            )}
            {loading && posts.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-creco-muted">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {t.adminNews.loading}
              </p>
            ) : sortedPosts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-creco-primary/20 px-4 py-8 text-center">
                <Newspaper className="mx-auto size-8 text-creco-primary/40" aria-hidden />
                <p className="mt-3 font-semibold text-creco-primary">{t.adminNews.emptyTitle}</p>
                <p className="mt-1 text-sm text-creco-muted">{t.adminNews.emptyLead}</p>
              </div>
            ) : (
              <ul className="divide-y divide-creco-primary/10">
                {sortedPosts.map((post) => (
                  <li key={post.id}>
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      className="flex w-full flex-col gap-1 px-1 py-3 text-left transition hover:bg-creco-primary/5 rounded-md"
                    >
                      <span className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-creco-muted">
                        <span>{t.adminNews.categories[post.category]}</span>
                        <span aria-hidden>·</span>
                        <time dateTime={post.publishedAt}>
                          {formatNewsDate(post.publishedAt, locale)}
                        </time>
                        <span
                          className={
                            post.published ? "text-creco-primary" : "text-creco-muted"
                          }
                        >
                          {post.published ? t.adminNews.statusPublished : t.adminNews.statusDraft}
                        </span>
                      </span>
                      <span className="font-semibold text-creco-primary">{post.titleEn}</span>
                      <span className="line-clamp-2 text-sm text-creco-muted">{post.summaryEn}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="creco-card border-creco-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId === "new"
                ? t.adminNews.create
                : editingId
                  ? t.adminNews.edit
                  : t.adminNews.create}
            </CardTitle>
            {!showForm && (
              <CardDescription>{t.adminNews.emptyLead}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!showForm ? (
              <p className="text-sm text-creco-muted">
                {t.adminNews.create} — {t.adminNews.description}
              </p>
            ) : (
              <form className="space-y-6" onSubmit={handleSave}>
                {notice && (
                  <p className="rounded-md bg-creco-primary/10 px-3 py-2 text-sm text-creco-primary">
                    {notice}
                  </p>
                )}
                {error && (
                  <p className="creco-form-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormSelect
                    id="news-category"
                    label={t.adminNews.category}
                    value={draft.category}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, category: e.target.value as NewsCategory }))
                    }
                  >
                    {NEWS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {t.adminNews.categories[cat]}
                      </option>
                    ))}
                  </FormSelect>
                  <FormField
                    id="news-date"
                    type="datetime-local"
                    label={t.adminNews.storyDate}
                    value={draft.publishedAtLocal}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, publishedAtLocal: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="news-published"
                    checked={draft.published}
                    onCheckedChange={(checked) =>
                      setDraft((d) => ({ ...d, published: checked === true }))
                    }
                  />
                  <Label htmlFor="news-published" className="text-sm font-medium">
                    {draft.published ? t.adminNews.published : t.adminNews.hidden}
                  </Label>
                </div>

                <div className="creco-form-group">
                  <span className="creco-form-label">{t.adminNews.photo}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="creco-input text-sm"
                    onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
                  />
                  <p className="creco-form-hint">{t.adminNews.photoHint}</p>
                  {photoPreview && (
                    <div className="mt-3 space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreview}
                        alt=""
                        className="max-h-48 w-full rounded-lg object-cover border border-creco-primary/15"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={removePhoto}>
                        {t.adminNews.removePhoto}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 rounded-lg border border-creco-primary/10 bg-creco-primary/[0.03] p-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-creco-primary">
                    {t.adminNews.english}
                  </p>
                  <FormField
                    id="news-title-en"
                    label={t.adminNews.titleEn}
                    value={draft.titleEn}
                    onChange={(e) => setDraft((d) => ({ ...d, titleEn: e.target.value }))}
                    required
                  />
                  <FormTextarea
                    id="news-summary-en"
                    label={t.adminNews.summaryEn}
                    rows={3}
                    value={draft.summaryEn}
                    onChange={(e) => setDraft((d) => ({ ...d, summaryEn: e.target.value }))}
                    required
                  />
                  <FormTextarea
                    id="news-body-en"
                    label={t.adminNews.bodyEn}
                    rows={8}
                    value={draft.bodyEn}
                    onChange={(e) => setDraft((d) => ({ ...d, bodyEn: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-4 rounded-lg border border-dashed border-creco-primary/15 p-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-creco-muted">
                    {t.adminNews.swahili}
                  </p>
                  <FormField
                    id="news-title-sw"
                    label={t.adminNews.titleSw}
                    value={draft.titleSw}
                    onChange={(e) => setDraft((d) => ({ ...d, titleSw: e.target.value }))}
                  />
                  <FormTextarea
                    id="news-summary-sw"
                    label={t.adminNews.summarySw}
                    rows={3}
                    value={draft.summarySw}
                    onChange={(e) => setDraft((d) => ({ ...d, summarySw: e.target.value }))}
                  />
                  <FormTextarea
                    id="news-body-sw"
                    label={t.adminNews.bodySw}
                    rows={8}
                    value={draft.bodySw}
                    onChange={(e) => setDraft((d) => ({ ...d, bodySw: e.target.value }))}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        {t.adminNews.saving}
                      </>
                    ) : (
                      t.adminNews.save
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    {t.adminNews.cancel}
                  </Button>
                  {editingId && editingId !== "new" && (
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="gap-1.5"
                    >
                      {deleting ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : (
                        <Trash2 className="size-4" aria-hidden />
                      )}
                      {deleting ? t.adminNews.deleting : t.adminNews.delete}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
