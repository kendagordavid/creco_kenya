"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { authFetch, invalidateAuthCache, peekCachedJson } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import type { Dictionary } from "@/lib/i18n/messages/en";

type Reporter = {
  id: string;
  name: string;
  email: string;
  orgName: string;
  county?: string;
};

type AdminSubmission = {
  id: string;
  type: string;
  status: string;
  county: string;
  narrative: string;
  issueType?: string;
  severity?: string;
  reviewComment?: string;
  createdAt: string;
  reporter: Reporter | null;
};

const STATUS_CLASS: Record<string, string> = {
  pending: "creco-status-pending",
  under_review: "creco-status-review",
  approved: "creco-status-approved",
  rejected: "creco-status-rejected",
};

const STATUS_OPTIONS = ["pending", "under_review", "approved", "rejected"] as const;

function typeLabel(t: Dictionary, type: string): string {
  const labels = t.submissionTypes;
  if (type in labels) return labels[type as keyof typeof labels];
  return type;
}

function statusLabel(t: Dictionary, status: string): string {
  const labels = t.status;
  if (status in labels) return labels[status as keyof typeof labels];
  return status.replace("_", " ");
}

function commentDraftsFromSubmissions(
  submissions: AdminSubmission[],
): Record<string, string> {
  return Object.fromEntries(
    submissions.map((item) => [item.id, item.reviewComment ?? ""]),
  );
}

export function AdminReportsDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const cached = peekCachedJson<{ submissions?: AdminSubmission[]; error?: string }>(
    "/api/admin/submissions",
  );
  const { data, loading, error: queryError } = useAuthQuery<{
    submissions?: AdminSubmission[];
    error?: string;
  }>("/api/admin/submissions", { ttlMs: CACHE_TTL.admin });
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(
    () => (cached?.error ? [] : (cached?.submissions ?? [])),
  );
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(() =>
    commentDraftsFromSubmissions(cached?.error ? [] : (cached?.submissions ?? [])),
  );
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingCommentId, setSavingCommentId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const error = queryError ?? data?.error ?? "";

  useEffect(() => {
    if (data && !data.error) {
      const next = data.submissions ?? [];
      setSubmissions(next);
      setCommentDrafts(commentDraftsFromSubmissions(next));
    }
  }, [data]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return submissions;
    return submissions.filter((item) => item.status === statusFilter);
  }, [submissions, statusFilter]);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    setNotice("");

    try {
      const response = await authFetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setNotice(responseData.error ?? t.admin.statusFailed);
        return;
      }

      invalidateAuthCache("/api/admin/submissions");
      const updated = responseData.submission as AdminSubmission;
      setSubmissions((current) =>
        current.map((item) => (item.id === id ? { ...item, ...updated } : item)),
      );
      setNotice(t.admin.statusUpdated);
    } catch {
      setNotice(t.admin.statusFailed);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSaveComment(id: string) {
    const item = submissions.find((entry) => entry.id === id);
    if (!item) return;

    setSavingCommentId(id);
    setNotice("");

    const trimmedComment = (commentDrafts[id] ?? "").trim();

    try {
      const response = await authFetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: item.status,
          reviewComment: trimmedComment || null,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setNotice(responseData.error ?? t.admin.statusFailed);
        return;
      }

      invalidateAuthCache("/api/admin/submissions");
      const updated = responseData.submission as AdminSubmission;
      setSubmissions((current) =>
        current.map((entry) => (entry.id === id ? { ...entry, ...updated } : entry)),
      );
      setCommentDrafts((current) => ({
        ...current,
        [id]: updated.reviewComment ?? "",
      }));
      if (!updated.reviewComment) {
        setOpenCommentId((current) => (current === id ? null : current));
      }
      setNotice(t.admin.statusUpdated);
    } catch {
      setNotice(t.admin.statusFailed);
    } finally {
      setSavingCommentId(null);
    }
  }

  return (
    <DashboardShell title={t.admin.title} description={t.admin.description}>
      {loading && !data ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.admin.loading}
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : submissions.length === 0 ? (
        <Card className="border-0 shadow-md ring-1 ring-black/5">
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-creco-green-muted text-creco-primary">
              <ClipboardList className="size-7" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-bold text-creco-primary">{t.admin.emptyTitle}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.admin.emptyLead}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length === 1
                ? format(t.common.reportCount, { count: filtered.length })
                : format(t.common.reportsCount, { count: filtered.length })}
            </p>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{t.admin.filterLabel}</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-creco-border bg-white px-3 py-1.5 text-sm text-foreground"
              >
                <option value="all">{t.admin.filterAll}</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(t, status)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {notice && (
            <p className="rounded-lg border border-creco-primary/20 bg-creco-green-muted px-4 py-3 text-sm text-creco-primary">
              {notice}
            </p>
          )}

          {filtered.map((item) => {
            const commentDraft = commentDrafts[item.id] ?? item.reviewComment ?? "";
            const hasComment = Boolean(item.reviewComment?.trim());
            const commentOpen = openCommentId === item.id;

            return (
              <Card
                key={item.id}
                className="border-0 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base font-bold text-creco-primary">
                      {typeLabel(t, item.type)}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {item.county} ·{" "}
                      {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </CardDescription>
                  </div>
                  <span className={`creco-status-badge shrink-0 ${STATUS_CLASS[item.status] ?? ""}`}>
                    {statusLabel(t, item.status)}
                  </span>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-sm leading-relaxed text-foreground/90">{item.narrative}</p>

                  {item.reporter && (
                    <div className="rounded-lg bg-[var(--creco-green-muted)] px-4 py-3 text-sm">
                      <p className="font-semibold text-creco-primary">{t.admin.reporter}</p>
                      <p className="mt-1 text-foreground/90">
                        {item.reporter.name} · {item.reporter.orgName}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.reporter.email}</p>
                    </div>
                  )}

                  {hasComment && !commentOpen && (
                    <div className="rounded-lg border border-creco-border bg-muted/30 px-4 py-3 text-sm">
                      <p className="font-semibold text-creco-primary">{t.admin.reviewCommentLabel}</p>
                      <p className="mt-1 leading-relaxed text-foreground/90">{item.reviewComment}</p>
                    </div>
                  )}

                  {commentOpen && (
                    <div className="rounded-lg border border-creco-border bg-white px-3 py-3 text-sm">
                      <label className="block space-y-2">
                        <span className="font-medium text-creco-primary">
                          {t.admin.reviewCommentLabel}
                        </span>
                        <textarea
                          value={commentDraft}
                          disabled={savingCommentId === item.id}
                          onChange={(event) =>
                            setCommentDrafts((current) => ({
                              ...current,
                              [item.id]: event.target.value,
                            }))
                          }
                          rows={3}
                          placeholder={t.admin.reviewCommentPlaceholder}
                          className="w-full resize-y rounded-lg border border-creco-border bg-white px-3 py-2 text-sm leading-relaxed text-foreground disabled:opacity-60"
                        />
                        <span className="block text-xs text-muted-foreground">
                          {t.admin.reviewCommentHint}
                        </span>
                      </label>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          disabled={savingCommentId === item.id}
                          onClick={() => handleSaveComment(item.id)}
                          className="inline-flex h-8 items-center rounded-lg bg-creco-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-creco-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingCommentId === item.id ? (
                            <>
                              <Loader2 className="mr-1.5 size-3.5 animate-spin" aria-hidden />
                              {t.admin.loading}
                            </>
                          ) : (
                            t.admin.saveComment
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-creco-border pt-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t.common.referenceId}{" "}
                      <span className="font-mono">{item.id.slice(0, 8)}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-muted-foreground">
                          {t.admin.updateStatus}
                        </span>
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(event) => handleStatusChange(item.id, event.target.value)}
                          className="rounded-lg border border-creco-border bg-white px-3 py-1.5 text-sm disabled:opacity-60"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel(t, status)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        aria-label={t.admin.addReviewComment}
                        aria-expanded={commentOpen}
                        disabled={updatingId === item.id || savingCommentId === item.id}
                        onClick={() =>
                          setOpenCommentId((current) => (current === item.id ? null : item.id))
                        }
                        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:opacity-60 ${
                          hasComment || commentOpen
                            ? "border-creco-primary/30 bg-creco-green-muted text-creco-primary"
                            : "border-creco-border bg-white text-muted-foreground hover:border-creco-primary/30 hover:text-creco-primary"
                        }`}
                      >
                        <MessageSquare className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
