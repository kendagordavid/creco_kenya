"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  presetRange,
  todayInNairobi,
  type AnalyticsPreset,
} from "@/lib/analytics-range";
import { useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const PERIODS: Array<"all" | AnalyticsPreset> = [
  "all",
  "7d",
  "30d",
  "90d",
  "month",
  "quarter",
  "year",
];

export type ReportPeriod = "all" | AnalyticsPreset | "custom";

export type ReportFilterOption = {
  value: string;
  label: string;
};

export function useReportListFilters() {
  const [period, setPeriod] = useState<ReportPeriod>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");

  function selectPeriod(next: "all" | AnalyticsPreset) {
    if (next === "all") {
      setPeriod("all");
      setFrom("");
      setTo("");
      return;
    }
    const range = presetRange(next);
    setPeriod(next);
    setFrom(range.from);
    setTo(range.to);
  }

  function selectFrom(value: string) {
    setFrom(value);
    setPeriod(value || to ? "custom" : "all");
  }

  function selectTo(value: string) {
    setTo(value);
    setPeriod(from || value ? "custom" : "all");
  }

  function clear() {
    setPeriod("all");
    setFrom("");
    setTo("");
    setStatus("all");
    setKind("all");
  }

  const invalidRange = Boolean(from && to && from > to);
  const active = period !== "all" || status !== "all" || kind !== "all";

  return {
    period,
    from,
    to,
    status,
    kind,
    selectPeriod,
    selectFrom,
    selectTo,
    setStatus,
    setKind,
    clear,
    invalidRange,
    active,
  };
}

type Props = {
  period: ReportPeriod;
  from: string;
  to: string;
  onPeriod: (period: "all" | AnalyticsPreset) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
  onClear: () => void;
  invalidRange: boolean;
  active: boolean;
  countLabel: string;
  status: string;
  onStatus: (value: string) => void;
  statusOptions: ReportFilterOption[];
  kind: string;
  onKind: (value: string) => void;
  kindOptions: ReportFilterOption[];
  kindLabel: string;
  kindAllLabel: string;
};

export function ReportListFilters({
  period,
  from,
  to,
  onPeriod,
  onFrom,
  onTo,
  onClear,
  invalidRange,
  active,
  countLabel,
  status,
  onStatus,
  statusOptions,
  kind,
  onKind,
  kindOptions,
  kindLabel,
  kindAllLabel,
}: Props) {
  const t = useTranslations();
  const today = todayInNairobi();

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm ring-1 ring-border/60">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{countLabel}</p>
          {active && (
            <button
              type="button"
              onClick={onClear}
              className="creco-staff-text-btn"
            >
              <X className="size-3.5" aria-hidden />
              {t.reportFilters.clear}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label={t.reportFilters.periodLabel}>
          {PERIODS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onPeriod(item)}
              className={cn("creco-staff-pill", period === item && "is-active")}
            >
              {item === "all" ? t.reportFilters.allTime : t.adminAnalytics.presets[item]}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-medium">
            {t.reportFilters.from}
            <input
              type="date"
              value={from}
              max={to || today}
              onChange={(event) => onFrom(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3"
            />
          </label>
          <label className="text-sm font-medium">
            {t.reportFilters.to}
            <input
              type="date"
              value={to}
              min={from || undefined}
              max={today}
              onChange={(event) => onTo(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3"
            />
          </label>
          <label className="text-sm font-medium">
            {t.reportFilters.status}
            <select
              value={status}
              onChange={(event) => onStatus(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="all">{t.reportFilters.allStatuses}</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            {kindLabel}
            <select
              value={kind}
              onChange={(event) => onKind(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="all">{kindAllLabel}</option>
              {kindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {invalidRange && (
          <p className="text-sm text-destructive">{t.reportFilters.invalidRange}</p>
        )}
      </div>
    </section>
  );
}
