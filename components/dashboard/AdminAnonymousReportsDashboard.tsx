"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Megaphone, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { ReportListFilters, useReportListFilters } from "@/components/dashboard/ReportListFilters";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { authFetch, invalidateAuthCache, peekCachedJson } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import { inDateRange } from "@/lib/report-date";
import type { Dictionary } from "@/lib/i18n/messages/en";

type AnonymousReport = {
  id: string;
  category: "system" | "other";
  subject: string;
  details: string;
  contactEmail?: string;
  status: string;
  staffNote?: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["received", "under_review", "resolved", "closed"] as const;

const STATUS_CLASS: Record<string, string> = {
  received: "creco-status-pending",
  under_review: "creco-status-review",
  resolved: "creco-status-approved",
  closed: "creco-status-rejected",
};

function statusLabel(t: Dictionary, status: string): string {
  const labels = t.adminAnonymous.status;
  if (status in labels) return labels[status as keyof typeof labels];
  return status.replaceAll("_", " ");
}

function categoryLabel(t: Dictionary, category: string): string {
  const labels = t.adminAnonymous.category;
  if (category in labels) return labels[category as keyof typeof labels];
  return category;
}

export function AdminAnonymousReportsDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const cached = peekCachedJson<{ reports?: AnonymousReport[]; error?: string }>(
    "/api/admin/anonymous-reports",
  );
  const { data, loading, error: queryError } = useAuthQuery<{
    reports?: AnonymousReport[];
    error?: string;
  }>("/api/admin/anonymous-reports", { ttlMs: CACHE_TTL.admin });
  const [reports, setReports] = useState<AnonymousReport[]>(
    () => (cached?.error ? [] : (cached?.reports ?? [])),
  );
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const filters = useReportListFilters();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const error = queryError ?? data?.error ?? "";

  useEffect(() => {
    if (data && !data.error) {
      const next = data.reports ?? [];
      setReports(next);
      setNoteDrafts(Object.fromEntries(next.map((item) => [item.id, item.staffNote ?? ""])));
    }
  }, [data]);

  const filtered = useMemo(() => {
    return reports.filter((item) => {
      if (filters.status !== "all" && item.status !== filters.status) return false;
      if (filters.kind !== "all" && item.category !== filters.kind) return false;
      if (
        !filters.invalidRange &&
        !inDateRange(item.createdAt, filters.from, filters.to)
      ) {
        return false;
      }
      return true;
    });
  }, [
    reports,
    filters.status,
    filters.kind,
    filters.from,
    filters.to,
    filters.invalidRange,
  ]);

  async function patchReport(id: string, body: { status: string; staffNote?: string | null }) {
    const response = await authFetch(`/api/admin/anonymous-reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.error ?? t.adminAnonymous.statusFailed);
    }
    invalidateAuthCache("/api/admin/anonymous-reports");
    return responseData.report as AnonymousReport;
  }

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    setNotice("");
    try {
      const updated = await patchReport(id, { status });
      setReports((current) => current.map((item) => (item.id === id ? { ...item, ...updated } : item)));
      setNotice(t.adminAnonymous.statusUpdated);
    } catch {
      setNotice(t.adminAnonymous.statusFailed);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSaveNote(id: string) {
    const item = reports.find((entry) => entry.id === id);
    if (!item) return;
    setSavingNoteId(id);
    setNotice("");
    try {
      const updated = await patchReport(id, {
        status: item.status,
        staffNote: (noteDrafts[id] ?? "").trim() || null,
      });
      setReports((current) => current.map((entry) => (entry.id === id ? { ...entry, ...updated } : entry)));
      setNoteDrafts((current) => ({ ...current, [id]: updated.staffNote ?? "" }));
      if (!updated.staffNote) {
        setOpenNoteId((current) => (current === id ? null : current));
      }
      setNotice(t.adminAnonymous.statusUpdated);
    } catch {
      setNotice(t.adminAnonymous.statusFailed);
    } finally {
      setSavingNoteId(null);
    }
  }

  return (
    <AdminShell title={t.adminAnonymous.title} description={t.adminAnonymous.description}>
      {loading && !data ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.adminAnonymous.loading}
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card className="border-0 shadow-md ring-1 ring-black/5">
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-creco-green-muted text-creco-primary">
              <Megaphone className="size-7" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-bold text-creco-primary">{t.adminAnonymous.emptyTitle}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.adminAnonymous.emptyLead}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <ReportListFilters
            period={filters.period}
            from={filters.from}
            to={filters.to}
            onPeriod={filters.selectPeriod}
            onFrom={filters.selectFrom}
            onTo={filters.selectTo}
            onClear={filters.clear}
            invalidRange={filters.invalidRange}
            active={filters.active}
            countLabel={
              filtered.length === 1
                ? format(t.common.reportCount, { count: filtered.length })
                : format(t.common.reportsCount, { count: filtered.length })
            }
            status={filters.status}
            onStatus={filters.setStatus}
            statusOptions={STATUS_OPTIONS.map((status) => ({
              value: status,
              label: statusLabel(t, status),
            }))}
            kind={filters.kind}
            onKind={filters.setKind}
            kindLabel={t.reportFilters.category}
            kindAllLabel={t.reportFilters.allCategories}
            kindOptions={(["system", "other"] as const).map((category) => ({
              value: category,
              label: categoryLabel(t, category),
            }))}
          />

          {notice && (
            <p className="rounded-lg border border-creco-primary/20 bg-creco-green-muted px-4 py-3 text-sm text-creco-primary">
              {notice}
            </p>
          )}

          {filtered.length === 0 ? (
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
              <CardContent className="px-6 py-10 text-center">
                <h3 className="text-lg font-bold text-creco-primary">{t.reportFilters.noMatchesTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.reportFilters.noMatchesLead}
                </p>
              </CardContent>
            </Card>
          ) : filtered.map((item) => {
            const noteOpen = openNoteId === item.id;
            const hasNote = Boolean(item.staffNote?.trim());
            return (
              <Card key={item.id} className="border-0 shadow-sm ring-1 ring-black/5">
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base font-bold text-creco-primary">{item.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      {categoryLabel(t, item.category)} ·{" "}
                      {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </CardDescription>
                  </div>
                  <span className={`creco-status-badge shrink-0 ${STATUS_CLASS[item.status] ?? ""}`}>
                    {statusLabel(t, item.status)}
                  </span>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="creco-break-words text-sm leading-relaxed text-foreground/90">{item.details}</p>
                  <div className="rounded-lg bg-[var(--creco-green-muted)] px-4 py-3 text-sm">
                    <p className="font-semibold text-creco-primary">{t.adminAnonymous.contact}</p>
                    <p className="mt-1 text-foreground/90">
                      {item.contactEmail ?? t.adminAnonymous.noContact}
                    </p>
                  </div>
                  {hasNote && !noteOpen && (
                    <div className="rounded-lg border border-creco-border bg-muted/30 px-4 py-3 text-sm">
                      <p className="font-semibold text-creco-primary">{t.adminAnonymous.staffNoteLabel}</p>
                      <p className="mt-1 leading-relaxed text-foreground/90">{item.staffNote}</p>
                    </div>
                  )}
                  {noteOpen && (
                    <div className="rounded-lg border border-creco-border bg-background px-3 py-3 text-sm">
                      <label className="block space-y-2">
                        <span className="font-medium text-creco-primary">{t.adminAnonymous.staffNoteLabel}</span>
                        <textarea
                          value={noteDrafts[item.id] ?? ""}
                          disabled={savingNoteId === item.id}
                          onChange={(event) =>
                            setNoteDrafts((current) => ({ ...current, [item.id]: event.target.value }))
                          }
                          rows={3}
                          placeholder={t.adminAnonymous.staffNotePlaceholder}
                          className="w-full resize-y rounded-lg border border-creco-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground"
                        />
                        <span className="block text-xs text-muted-foreground">
                          {t.adminAnonymous.staffNoteHint}
                        </span>
                      </label>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          disabled={savingNoteId === item.id}
                          onClick={() => handleSaveNote(item.id)}
                          className="inline-flex min-h-11 items-center rounded-lg bg-creco-primary px-3 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          {savingNoteId === item.id ? t.adminAnonymous.loading : t.adminAnonymous.saveNote}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-3 border-t border-creco-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t.common.referenceId} <span className="font-mono">{item.id.slice(0, 8).toUpperCase()}</span>
                    </p>
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                      <label className="flex min-w-0 flex-1 items-center gap-2 text-sm sm:flex-initial">
                        <span className="hidden font-medium text-muted-foreground sm:inline">
                          {t.adminAnonymous.updateStatus}
                        </span>
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(event) => handleStatusChange(item.id, event.target.value)}
                          className="h-11 min-w-0 flex-1 rounded-lg border border-creco-border bg-background px-3 text-sm disabled:opacity-60 sm:flex-initial"
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
                        aria-label={t.adminAnonymous.addStaffNote}
                        aria-expanded={noteOpen}
                        onClick={() => setOpenNoteId((current) => (current === item.id ? null : item.id))}
                        className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg border ${
                          hasNote || noteOpen
                            ? "border-creco-primary/30 bg-creco-green-muted text-creco-primary"
                            : "border-creco-border bg-background text-muted-foreground"
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
    </AdminShell>
  );
}
