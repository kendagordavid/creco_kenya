"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
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

type ReviewDraft = {
  status: string;
  reviewComment: string;
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

function draftsFromSubmissions(submissions: AdminSubmission[]): Record<string, ReviewDraft> {
  return Object.fromEntries(
    submissions.map((item) => [
      item.id,
      { status: item.status, reviewComment: item.reviewComment ?? "" },
    ]),
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
  const [drafts, setDrafts] = useState<Record<string, ReviewDraft>>(() =>
    draftsFromSubmissions(cached?.error ? [] : (cached?.submissions ?? [])),
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const error = queryError ?? data?.error ?? "";

  useEffect(() => {
    if (data && !data.error) {
      const next = data.submissions ?? [];
      setSubmissions(next);
      setDrafts(draftsFromSubmissions(next));
    }
  }, [data]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return submissions;
    return submissions.filter((item) => item.status === statusFilter);
  }, [submissions, statusFilter]);

  function updateDraft(id: string, patch: Partial<ReviewDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }));
  }

  async function handleSaveReview(id: string) {
    const draft = drafts[id];
    if (!draft) return;

    const trimmedComment = draft.reviewComment.trim();
    const requiresComment = draft.status === "approved" || draft.status === "rejected";

    if (requiresComment && !trimmedComment) {
      setNotice(t.admin.reviewCommentRequired);
      return;
    }

    setUpdatingId(id);
    setNotice("");

    const payload: { status: string; reviewComment?: string } = { status: draft.status };
    if (requiresComment) {
      payload.reviewComment = trimmedComment;
    }

    try {
      const response = await authFetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
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
      setDrafts((current) => ({
        ...current,
        [id]: {
          status: updated.status,
          reviewComment: updated.reviewComment ?? "",
        },
      }));
      setNotice(t.admin.statusUpdated);
    } catch {
      setNotice(t.admin.statusFailed);
    } finally {
      setUpdatingId(null);
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
            const draft = drafts[item.id] ?? {
              status: item.status,
              reviewComment: item.reviewComment ?? "",
            };
            const requiresComment =
              draft.status === "approved" || draft.status === "rejected";

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

                  {item.reviewComment && (
                    <div className="rounded-lg border border-creco-border bg-muted/30 px-4 py-3 text-sm">
                      <p className="font-semibold text-creco-primary">{t.admin.reviewCommentLabel}</p>
                      <p className="mt-1 leading-relaxed text-foreground/90">{item.reviewComment}</p>
                    </div>
                  )}

                  <div className="space-y-3 rounded-lg border border-creco-border bg-white px-4 py-4">
                    <label className="block space-y-2 text-sm">
                      <span className="font-semibold text-creco-primary">
                        {t.admin.reviewCommentLabel}
                      </span>
                      <textarea
                        value={draft.reviewComment}
                        disabled={updatingId === item.id}
                        onChange={(event) =>
                          updateDraft(item.id, { reviewComment: event.target.value })
                        }
                        rows={4}
                        placeholder={t.admin.reviewCommentPlaceholder}
                        className="w-full resize-y rounded-lg border border-creco-border bg-white px-3 py-2 text-sm leading-relaxed text-foreground disabled:opacity-60"
                      />
                      <span className="block text-xs text-muted-foreground">
                        {t.admin.reviewCommentHint}
                      </span>
                    </label>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-creco-border pt-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t.common.referenceId}{" "}
                        <span className="font-mono">{item.id.slice(0, 8)}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-muted-foreground">
                            {t.admin.updateStatus}
                          </span>
                          <select
                            value={draft.status}
                            disabled={updatingId === item.id}
                            onChange={(event) =>
                              updateDraft(item.id, { status: event.target.value })
                            }
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
                          disabled={updatingId === item.id || (requiresComment && !draft.reviewComment.trim())}
                          onClick={() => handleSaveReview(item.id)}
                          className="inline-flex h-9 items-center rounded-lg bg-creco-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-creco-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId === item.id ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                              {t.admin.loading}
                            </>
                          ) : (
                            t.admin.saveReview
                          )}
                        </button>
                      </div>
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
