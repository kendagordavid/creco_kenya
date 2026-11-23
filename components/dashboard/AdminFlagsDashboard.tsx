"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Flag, Loader2, MessageSquare, PenLine } from "lucide-react";
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
import { authFetch, invalidateAuthCache } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import { inDateRange } from "@/lib/report-date";
import type { Dictionary } from "@/lib/i18n/messages/en";

type FlagItem = {
  id: string;
  question: string;
  reason: string;
  details?: string;
  status: string;
  staffNote?: string;
  reporter?: { name: string; email: string; orgName: string };
  reviewerName?: string;
  createdAt: string;
  updatedAt: string;
};

type FlagsResponse = { flags?: FlagItem[]; error?: string };

const API = "/api/admin/flags";

const STATUS_OPTIONS = ["open", "reviewing", "answer_updated", "dismissed"] as const;

const STATUS_CLASS: Record<string, string> = {
  open: "creco-status-pending",
  reviewing: "creco-status-review",
  answer_updated: "creco-status-approved",
  dismissed: "creco-status-rejected",
};

/** Reasons offered by the public flag form (components/FlagFeedbackForm.tsx), stored in English. */
const REASONS = [
  "Inaccurate or incomplete",
  "Out of date",
  "Missing source citation",
  "Unclear language",
  "Other",
] as const;

function statusLabel(t: Dictionary, status: string): string {
  const labels = t.adminFlags.status;
  return status in labels ? labels[status as keyof typeof labels] : status.replaceAll("_", " ");
}

function reasonLabel(t: Dictionary, reason: string): string {
  const labels = t.adminFlags.reasons;
  return reason in labels ? labels[reason as keyof typeof labels] : reason;
}

export function AdminFlagsDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const { data, loading, error: queryError } = useAuthQuery<FlagsResponse>(API, {
    ttlMs: CACHE_TTL.admin,
  });
  const [flags, setFlags] = useState<FlagItem[]>(() => (data?.error ? [] : (data?.flags ?? [])));
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const filters = useReportListFilters();
  const error = queryError ?? data?.error ?? "";

  // Adopt fresh server data during render (not in an effect) so local edits start from it.
  const [syncedData, setSyncedData] = useState(data);
  if (data !== syncedData) {
    setSyncedData(data);
    if (data && !data.error) {
      const next = data.flags ?? [];
      setFlags(next);
      setNoteDrafts(Object.fromEntries(next.map((item) => [item.id, item.staffNote ?? ""])));
    }
  }

  const openCount = flags.filter((item) => item.status === "open").length;

  const filtered = useMemo(
    () =>
      flags.filter((item) => {
        if (filters.status !== "all" && item.status !== filters.status) return false;
        if (filters.kind !== "all" && item.reason !== filters.kind) return false;
        if (!filters.invalidRange && !inDateRange(item.createdAt, filters.from, filters.to)) return false;
        return true;
      }),
    [flags, filters.status, filters.kind, filters.from, filters.to, filters.invalidRange],
  );

  async function patchFlag(id: string, body: { status: string; staffNote?: string | null }) {
    setBusyId(id);
    setNotice("");
    try {
      const response = await authFetch(`${API}/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      invalidateAuthCache(API);
      const updated = payload.flag as FlagItem;
      setFlags((current) => current.map((item) => (item.id === id ? updated : item)));
      setNoteDrafts((current) => ({ ...current, [id]: updated.staffNote ?? "" }));
      if (body.staffNote !== undefined) setOpenNoteId(null);
      setNotice(t.adminFlags.updated);
    } catch {
      setNotice(t.adminFlags.updateFailed);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell title={t.adminFlags.title} description={t.adminFlags.description}>
      {loading && !data ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.adminFlags.loading}
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : flags.length === 0 ? (
        <Card className="border-0 shadow-md ring-1 ring-black/5">
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-creco-green-muted text-creco-primary">
              <Flag className="size-7" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-bold text-creco-primary">{t.adminFlags.emptyTitle}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{t.adminFlags.emptyLead}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-creco-primary">
            {format(t.adminFlags.openCount, { count: openCount })}
          </p>
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
            countLabel={format(t.adminFlags.count, { count: filtered.length })}
            status={filters.status}
            onStatus={filters.setStatus}
            statusOptions={STATUS_OPTIONS.map((status) => ({ value: status, label: statusLabel(t, status) }))}
            kind={filters.kind}
            onKind={filters.setKind}
            kindLabel={t.adminFlags.reasonLabel}
            kindAllLabel={t.adminFlags.allReasons}
            kindOptions={REASONS.map((reason) => ({ value: reason, label: reasonLabel(t, reason) }))}
          />

          {notice && (
            <p
              role="status"
              className="rounded-lg border border-creco-primary/20 bg-creco-green-muted px-4 py-3 text-sm text-creco-primary"
            >
              {notice}
            </p>
          )}

          {filtered.length === 0 ? (
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
              <CardContent className="px-6 py-10 text-center">
                <h3 className="text-lg font-bold text-creco-primary">{t.reportFilters.noMatchesTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.reportFilters.noMatchesLead}</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((item) => {
              const noteOpen = openNoteId === item.id;
              const busy = busyId === item.id;
              return (
                <Card key={item.id} className="border-0 shadow-sm ring-1 ring-black/5">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                    <div className="min-w-0">
                      <CardTitle className="creco-break-words text-base font-bold text-creco-primary">
                        {item.question}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {reasonLabel(t, item.reason)} ·{" "}
                        {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                      </CardDescription>
                    </div>
                    <span className={`creco-status-badge shrink-0 ${STATUS_CLASS[item.status] ?? ""}`}>
                      {statusLabel(t, item.status)}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {item.details && (
                      <p className="creco-break-words text-sm leading-relaxed text-foreground/90">{item.details}</p>
                    )}
                    <div className="rounded-lg bg-[var(--creco-green-muted)] px-4 py-3 text-sm">
                      <p className="font-semibold text-creco-primary">{t.adminFlags.reportedBy}</p>
                      <p className="mt-1 text-foreground/90">
                        {item.reporter
                          ? `${item.reporter.name} · ${item.reporter.orgName} · ${item.reporter.email}`
                          : t.adminFlags.anonymous}
                      </p>
                    </div>
                    {item.staffNote && !noteOpen && (
                      <div className="rounded-lg border border-creco-border bg-muted/30 px-4 py-3 text-sm">
                        <p className="font-semibold text-creco-primary">{t.adminFlags.staffNote}</p>
                        <p className="mt-1 leading-relaxed text-foreground/90">{item.staffNote}</p>
                        {item.reviewerName && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {format(t.adminFlags.reviewedBy, { name: item.reviewerName })}
                          </p>
                        )}
                      </div>
                    )}
                    {noteOpen && (
                      <div className="rounded-lg border border-creco-border bg-background px-3 py-3 text-sm">
                        <label className="block space-y-2">
                          <span className="font-medium text-creco-primary">{t.adminFlags.staffNote}</span>
                          <textarea
                            value={noteDrafts[item.id] ?? ""}
                            disabled={busy}
                            onChange={(event) =>
                              setNoteDrafts((current) => ({ ...current, [item.id]: event.target.value }))
                            }
                            rows={3}
                            placeholder={t.adminFlags.staffNotePlaceholder}
                            className="w-full resize-y rounded-lg border border-creco-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground"
                          />
                        </label>
                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              patchFlag(item.id, {
                                status: item.status,
                                staffNote: (noteDrafts[item.id] ?? "").trim() || null,
                              })
                            }
                            className="inline-flex min-h-11 items-center rounded-lg bg-creco-primary px-3 text-xs font-semibold text-white disabled:opacity-60"
                          >
                            {busy ? t.adminFlags.saving : t.adminFlags.saveNote}
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-3 border-t border-creco-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <a
                          href={`/guidance?q=${encodeURIComponent(item.question)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-creco-primary no-underline hover:underline"
                        >
                          <ExternalLink className="size-4" aria-hidden />
                          {t.adminFlags.reask}
                        </a>
                        <Link
                          href="/admin/content"
                          className="inline-flex items-center gap-1.5 font-semibold text-creco-primary no-underline hover:underline"
                        >
                          <PenLine className="size-4" aria-hidden />
                          {t.adminFlags.editContent}
                        </Link>
                      </div>
                      <div className="flex w-full items-center gap-2 sm:w-auto">
                        <label className="flex min-w-0 flex-1 items-center gap-2 text-sm sm:flex-initial">
                          <span className="hidden font-medium text-muted-foreground sm:inline">
                            {t.adminFlags.updateStatus}
                          </span>
                          <select
                            value={item.status}
                            disabled={busy}
                            onChange={(event) => patchFlag(item.id, { status: event.target.value })}
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
                          aria-label={t.adminFlags.addNote}
                          aria-expanded={noteOpen}
                          onClick={() => setOpenNoteId((current) => (current === item.id ? null : item.id))}
                          className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg border ${
                            item.staffNote || noteOpen
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
            })
          )}
        </div>
      )}
    </AdminShell>
  );
}
