"use client";

import { useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { authFetch } from "@/lib/auth-client";
import type { AdminAnalytics } from "@/lib/admin-analytics";
import {
  presetRange,
  todayInNairobi,
  validateAnalyticsRange,
  type AnalyticsPreset,
} from "@/lib/analytics-range";
import { CACHE_TTL } from "@/lib/browser-cache";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const PRESETS: AnalyticsPreset[] = ["7d", "30d", "90d", "month", "quarter", "year"];

type AnalyticsResponse = AdminAnalytics & { error?: string };

function deltaLabel(current: number, previous: number, same: string, versus: string) {
  const diff = current - previous;
  if (diff === 0) return same;
  const sign = diff > 0 ? "+" : "";
  return versus.replace("{delta}", `${sign}${diff}`);
}

export function AdminAnalyticsDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const initial = presetRange("30d");
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [preset, setPreset] = useState<AnalyticsPreset | "custom">("30d");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const rangeError = useMemo(() => {
    const validated = validateAnalyticsRange(from, to);
    return validated.ok ? "" : validated.error;
  }, [from, to]);

  const queryUrl = rangeError ? null : `/api/admin/analytics?from=${from}&to=${to}`;

  const { data, loading, error: queryError } = useAuthQuery<AnalyticsResponse>(
    queryUrl ?? "/api/admin/analytics",
    { ttlMs: CACHE_TTL.admin, enabled: !rangeError },
  );

  const error = queryError || data?.error || "";

  function applyPreset(next: AnalyticsPreset) {
    const range = presetRange(next);
    setPreset(next);
    setFrom(range.from);
    setTo(range.to);
  }

  async function exportCsv() {
    setExportError("");
    setExporting(true);
    try {
      const response = await authFetch(`/api/admin/analytics/export?from=${from}&to=${to}`);
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setExportError(body?.error ?? t.adminAnalytics.exportFailed);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `creco-analytics-${from}-to-${to}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError(t.adminAnalytics.exportFailed);
    } finally {
      setExporting(false);
    }
  }

  const stats = data
    ? [
        {
          label: t.adminAnalytics.metrics.newOrganisations,
          value: data.summary.newOrganisations,
          previous: data.previous.newOrganisations,
        },
        {
          label: t.adminAnalytics.metrics.submissions,
          value: data.summary.submissions,
          previous: data.previous.submissions,
        },
        {
          label: t.adminAnalytics.metrics.anonymousReports,
          value: data.summary.anonymousReports,
          previous: data.previous.anonymousReports,
        },
        {
          label: t.adminAnalytics.metrics.feedback,
          value: data.summary.feedback,
          previous: data.previous.feedback,
        },
        {
          label: t.adminAnalytics.metrics.checklistUpdates,
          value: data.summary.checklistUpdates,
          previous: data.previous.checklistUpdates,
        },
        {
          label: t.adminAnalytics.metrics.assessmentUpdates,
          value: data.summary.assessmentUpdates,
          previous: data.previous.assessmentUpdates,
        },
      ]
    : [];

  return (
    <AdminShell title={t.adminAnalytics.title} description={t.adminAnalytics.description}>
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm ring-1 ring-border/60">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.adminAnalytics.periodLabel}>
            {PRESETS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => applyPreset(item)}
                className={cn("creco-staff-pill", preset === item && "is-active")}
              >
                {t.adminAnalytics.presets[item]}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
            <label className="text-sm font-medium">
              {t.adminAnalytics.from}
              <input
                type="date"
                value={from}
                max={to || todayInNairobi()}
                onChange={(event) => {
                  setPreset("custom");
                  setFrom(event.target.value);
                }}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3"
              />
            </label>
            <label className="text-sm font-medium">
              {t.adminAnalytics.to}
              <input
                type="date"
                value={to}
                min={from}
                max={todayInNairobi()}
                onChange={(event) => {
                  setPreset("custom");
                  setTo(event.target.value);
                }}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3"
              />
            </label>
            <div className="flex w-full items-end sm:w-auto">
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => void exportCsv()}
                disabled={!!rangeError || exporting}
              >
                {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                {t.adminAnalytics.export}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(t.adminAnalytics.timezoneNote, { timezone: "Africa/Nairobi" })}
            {data
              ? ` ${format(t.adminAnalytics.previousNote, {
                  from: data.previousRange.from,
                  to: data.previousRange.to,
                })}`
              : ""}
          </p>
          {(rangeError || exportError) && (
            <p className="text-sm text-destructive">{rangeError || exportError}</p>
          )}
        </div>
      </section>

      {loading && !data ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.adminAnalytics.loading}
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : data ? (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={t.adminAnalytics.summaryLabel}>
            {stats.map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm ring-1 ring-border/60">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider">
                    {stat.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold tabular-nums text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {deltaLabel(
                      stat.value,
                      stat.previous,
                      t.adminAnalytics.sameAsPrevious,
                      t.adminAnalytics.versusPrevious,
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <BreakdownCard title={t.adminAnalytics.byType} rows={data.submissionsByType} empty={t.adminAnalytics.empty} />
            <BreakdownCard title={t.adminAnalytics.byStatus} rows={data.submissionsByStatus} empty={t.adminAnalytics.empty} />
            <BreakdownCard title={t.adminAnalytics.byCounty} rows={data.submissionsByCounty} empty={t.adminAnalytics.empty} />
            <BreakdownCard
              title={t.adminAnalytics.byAnonymous}
              rows={[...data.anonymousByCategory, ...data.anonymousByStatus]}
              empty={t.adminAnalytics.empty}
            />
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}

function BreakdownCard({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { key: string; count: number }[];
  empty: string;
}) {
  return (
    <Card className="border-0 shadow-sm ring-1 ring-border/60">
      <CardHeader>
        <CardDescription className="text-base font-bold text-foreground">{title}</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={`${title}-${row.key}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="capitalize">{row.key.replaceAll("_", " ")}</span>
                <span className="font-semibold tabular-nums">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
