"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { CACHE_TTL } from "@/lib/browser-cache";
import { CHECKLIST_SECTIONS } from "@/lib/content/checklist";
import { ASSESSMENT_QUESTIONS } from "@/lib/content/assessment";
import {
  assessmentBandStyles,
  checklistTier,
  tierStyles,
  type ProgressTier,
} from "@/lib/compliance-progress";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

type OrgRecord = {
  user: {
    id: string;
    name: string;
    email: string;
    orgName: string;
    orgType?: string;
    county?: string;
    createdAt: string;
  };
  reportCount: number;
  checklist: {
    completed: number;
    total: number;
    percent: number;
    started: boolean;
    sections: { id: string; title: string; completed: number; total: number; percent: number }[];
    items: Record<string, boolean>;
    updatedAt: string | null;
  };
  assessment: {
    percent: number;
    band: string;
    summary: string;
    answered: number;
    total: number;
    byDomain: Record<string, number>;
    answers: Record<string, number>;
    updatedAt: string | null;
  } | null;
};

type ComplianceResponse = {
  summary: {
    organisations: number;
    checklistStarted: number;
    assessmentStarted: number;
    avgChecklistPercent: number;
    avgAssessmentPercent: number;
    atRisk: number;
  };
  organisations: OrgRecord[];
  error?: string;
};

type SortKey = "checklist" | "assessment" | "org" | "recent";
type ViewMode = "grid" | "list";

function ProgressRing({
  percent,
  tier,
  size = 88,
}: {
  percent: number;
  tier: ProgressTier;
  size?: number;
}) {
  const stroke = tierStyles(tier).ring;
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(stroke, "transition-all duration-700")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold tabular-nums text-foreground">{percent}%</span>
        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground">
          checklist
        </span>
      </div>
    </div>
  );
}

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function AdminComplianceDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const { data, loading, error: queryError } = useAuthQuery<ComplianceResponse>(
    "/api/admin/compliance",
    { ttlMs: CACHE_TTL.admin },
  );

  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("all");
  const [tierFilter, setTierFilter] = useState<ProgressTier | "all">("all");
  const [sort, setSort] = useState<SortKey>("checklist");
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<OrgRecord | null>(null);

  const organisations = data?.organisations ?? [];
  const summary = data?.summary;
  const error = queryError ?? data?.error ?? "";

  const counties = useMemo(() => {
    const set = new Set<string>();
    for (const org of organisations) {
      if (org.user.county) set.add(org.user.county);
    }
    return [...set].sort();
  }, [organisations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = organisations.filter((org) => {
      const tier = checklistTier(org.checklist.percent, org.checklist.started);
      if (tierFilter !== "all" && tier !== tierFilter) return false;
      if (county !== "all" && org.user.county !== county) return false;
      if (!q) return true;
      const haystack = `${org.user.orgName} ${org.user.name} ${org.user.email} ${org.user.county ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });

    rows = [...rows].sort((a, b) => {
      switch (sort) {
        case "org":
          return a.user.orgName.localeCompare(b.user.orgName);
        case "assessment":
          return (b.assessment?.percent ?? -1) - (a.assessment?.percent ?? -1);
        case "recent": {
          const aTime = a.checklist.updatedAt ?? a.user.createdAt;
          const bTime = b.checklist.updatedAt ?? b.user.createdAt;
          return bTime.localeCompare(aTime);
        }
        default:
          return b.checklist.percent - a.checklist.percent;
      }
    });

    return rows;
  }, [organisations, search, county, tierFilter, sort]);

  const sectionAverages = useMemo(() => {
    if (filtered.length === 0) return [];
    return CHECKLIST_SECTIONS.map((section) => {
      const percent = Math.round(
        filtered.reduce((sum, org) => {
          const match = org.checklist.sections.find((entry) => entry.id === section.id);
          return sum + (match?.percent ?? 0);
        }, 0) / filtered.length,
      );
      return { id: section.id, title: section.title, percent, tier: checklistTier(percent, percent > 0) };
    });
  }, [filtered]);

  const tierCounts = useMemo(() => {
    const counts: Record<ProgressTier, number> = {
      none: 0,
      at_risk: 0,
      emerging: 0,
      progressing: 0,
      strong: 0,
    };
    for (const org of filtered) {
      const tier = checklistTier(org.checklist.percent, org.checklist.started);
      counts[tier] += 1;
    }
    return counts;
  }, [filtered]);

  const tierTotal = filtered.length || 1;

  return (
    <DashboardShell
      title={t.adminCompliance.title}
      description={t.adminCompliance.description}
    >
      {loading && !data ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.adminCompliance.loading}
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Portfolio summary */}
          <section
            aria-label={t.adminCompliance.summaryLabel}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {[
              {
                label: t.adminCompliance.stats.organisations,
                value: String(summary?.organisations ?? 0),
                sub: format(t.adminCompliance.stats.tracking, {
                  count: summary?.checklistStarted ?? 0,
                }),
                icon: Building2,
                accent: "from-creco-green-deep/10 to-creco-green-muted",
              },
              {
                label: t.adminCompliance.stats.avgChecklist,
                value: `${summary?.avgChecklistPercent ?? 0}%`,
                sub: t.adminCompliance.stats.checklistSub,
                icon: ClipboardCheck,
                accent: "from-sky-500/10 to-sky-50",
              },
              {
                label: t.adminCompliance.stats.avgAssessment,
                value: `${summary?.avgAssessmentPercent ?? 0}%`,
                sub: format(t.adminCompliance.stats.assessmentSub, {
                  count: summary?.assessmentStarted ?? 0,
                }),
                icon: Sparkles,
                accent: "from-amber-500/10 to-amber-50",
              },
              {
                label: t.adminCompliance.stats.atRisk,
                value: String(summary?.atRisk ?? 0),
                sub: t.adminCompliance.stats.atRiskSub,
                icon: AlertTriangle,
                accent: "from-red-500/10 to-red-50",
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                className={cn(
                  "overflow-hidden border-0 shadow-sm ring-1 ring-border/60",
                  `bg-gradient-to-br ${stat.accent}`,
                )}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider">
                    {stat.label}
                  </CardDescription>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-background/80 text-creco-primary shadow-sm ring-1 ring-border/50">
                    <stat.icon className="size-4" aria-hidden />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Portfolio analytics */}
          {filtered.length > 0 && (
            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-border/60">
                <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
                  <CardTitle className="text-base font-bold text-creco-primary">
                    {t.adminCompliance.sectionHeatmap}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {t.adminCompliance.sectionHeatmapLead}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
                  {sectionAverages.map((section) => {
                    const styles = tierStyles(section.tier);
                    return (
                      <div
                        key={section.id}
                        className="rounded-xl border border-border/70 bg-gradient-to-br from-background to-muted/30 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-foreground">{section.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {t.adminCompliance.tiers[section.tier]}
                            </p>
                          </div>
                          <span className="text-2xl font-bold tabular-nums text-creco-primary">
                            {section.percent}%
                          </span>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full transition-all", styles.bar)}
                            style={{ width: `${section.percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-border/60">
                <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
                  <CardTitle className="text-base font-bold text-creco-primary">
                    {t.adminCompliance.tierDistribution}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {t.adminCompliance.tierDistributionLead}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                    {(["strong", "progressing", "emerging", "at_risk", "none"] as ProgressTier[]).map(
                      (tier) => {
                        const count = tierCounts[tier];
                        if (count === 0) return null;
                        const width = (count / tierTotal) * 100;
                        return (
                          <div
                            key={tier}
                            className={cn("h-full", tierStyles(tier).bar)}
                            style={{ width: `${width}%` }}
                            title={`${t.adminCompliance.tiers[tier]}: ${count}`}
                          />
                        );
                      },
                    )}
                  </div>
                  <ul className="space-y-2">
                    {(["strong", "progressing", "emerging", "at_risk", "none"] as ProgressTier[]).map(
                      (tier) => (
                        <li key={tier} className="flex items-center justify-between text-sm">
                          <span className="inline-flex items-center gap-2">
                            <span className={cn("size-2.5 rounded-full", tierStyles(tier).bar)} />
                            {t.adminCompliance.tiers[tier]}
                          </span>
                          <span className="font-semibold tabular-nums text-foreground">
                            {tierCounts[tier]}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Controls */}
          <Card className="border-0 shadow-sm ring-1 ring-border/60">
            <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative min-w-0 flex-1 lg:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.adminCompliance.searchPlaceholder}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  aria-label={t.adminCompliance.countyFilter}
                >
                  <option value="all">{t.adminCompliance.allCounties}</option>
                  {counties.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as ProgressTier | "all")}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  aria-label={t.adminCompliance.tierFilter}
                >
                  <option value="all">{t.adminCompliance.allTiers}</option>
                  <option value="at_risk">{t.adminCompliance.tiers.at_risk}</option>
                  <option value="emerging">{t.adminCompliance.tiers.emerging}</option>
                  <option value="progressing">{t.adminCompliance.tiers.progressing}</option>
                  <option value="strong">{t.adminCompliance.tiers.strong}</option>
                  <option value="none">{t.adminCompliance.tiers.none}</option>
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  aria-label={t.adminCompliance.sortLabel}
                >
                  <option value="checklist">{t.adminCompliance.sort.checklist}</option>
                  <option value="assessment">{t.adminCompliance.sort.assessment}</option>
                  <option value="org">{t.adminCompliance.sort.org}</option>
                  <option value="recent">{t.adminCompliance.sort.recent}</option>
                </select>
                <div className="flex rounded-lg border border-input p-0.5">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={cn(
                      "rounded-md p-2 transition",
                      view === "grid" ? "bg-creco-primary text-white" : "text-muted-foreground hover:bg-muted",
                    )}
                    aria-label={t.adminCompliance.gridView}
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={cn(
                      "rounded-md p-2 transition",
                      view === "list" ? "bg-creco-primary text-white" : "text-muted-foreground hover:bg-muted",
                    )}
                    aria-label={t.adminCompliance.listView}
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="flex flex-col items-center px-6 py-16 text-center">
                <Users className="size-10 text-muted-foreground" aria-hidden />
                <h3 className="mt-4 text-lg font-bold text-creco-primary">
                  {t.adminCompliance.emptyTitle}
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {t.adminCompliance.emptyLead}
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((org) => {
                const tier = checklistTier(org.checklist.percent, org.checklist.started);
                const styles = tierStyles(tier);
                return (
                  <button
                    key={org.user.id}
                    type="button"
                    onClick={() => setSelected(org)}
                    className="group rounded-2xl border border-border/70 bg-card p-5 text-left shadow-sm ring-1 ring-border/40 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-creco-primary"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-foreground group-hover:text-creco-primary">
                          {org.user.orgName}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">{org.user.name}</p>
                        {org.user.county && (
                          <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" aria-hidden />
                            {org.user.county}
                          </p>
                        )}
                        {org.reportCount > 0 && (
                          <p className="mt-1 text-xs font-medium text-muted-foreground">
                            {format(t.adminCompliance.reportsSubmitted, { count: org.reportCount })}
                          </p>
                        )}
                      </div>
                      <ProgressRing percent={org.checklist.percent} tier={tier} size={76} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider ring-1", styles.badge)}>
                        {t.adminCompliance.tiers[tier]}
                      </span>
                      {org.assessment && (
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider ring-1", assessmentBandStyles(org.assessment.band))}>
                          {t.adminCompliance.bands[org.assessment.band as keyof typeof t.adminCompliance.bands] ?? org.assessment.band}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 space-y-2">
                      {org.checklist.sections.map((section) => (
                        <div key={section.id}>
                          <div className="mb-1 flex justify-between text-[0.625rem] font-semibold uppercase tracking-wide text-muted-foreground">
                            <span className="truncate pr-2">{section.title}</span>
                            <span className="tabular-nums">
                              {section.completed}/{section.total}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn("h-full rounded-full transition-all", styles.bar)}
                              style={{ width: `${section.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 flex items-center gap-1 text-xs font-medium text-creco-primary">
                      {t.adminCompliance.viewDetail}
                      <ChevronRight className="size-3.5 transition group-hover:translate-x-0.5" />
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-border/60">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{t.adminCompliance.table.org}</th>
                      <th className="px-4 py-3 font-semibold">{t.adminCompliance.table.contact}</th>
                      <th className="px-4 py-3 font-semibold">{t.adminCompliance.table.checklist}</th>
                      <th className="px-4 py-3 font-semibold">{t.adminCompliance.table.assessment}</th>
                      <th className="px-4 py-3 font-semibold">{t.adminCompliance.table.updated}</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((org) => {
                      const tier = checklistTier(org.checklist.percent, org.checklist.started);
                      const styles = tierStyles(tier);
                      return (
                        <tr key={org.user.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground">{org.user.orgName}</p>
                            {org.user.county && (
                              <p className="text-xs text-muted-foreground">{org.user.county}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p>{org.user.name}</p>
                            <p className="text-xs text-muted-foreground">{org.user.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                                <div className={cn("h-full rounded-full", styles.bar)} style={{ width: `${org.checklist.percent}%` }} />
                              </div>
                              <span className="tabular-nums text-xs font-semibold">{org.checklist.percent}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {org.assessment ? (
                              <span className="font-semibold tabular-nums">{org.assessment.percent}%</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {formatWhen(org.checklist.updatedAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelected(org)}
                              className="text-xs font-semibold text-creco-primary hover:underline"
                            >
                              {t.adminCompliance.viewDetail}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
          role="presentation"
        >
          <div
            className="flex h-full w-full max-w-lg flex-col bg-background shadow-2xl ring-1 ring-border"
            role="dialog"
            aria-modal="true"
            aria-labelledby="compliance-detail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div className="min-w-0 pr-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-creco-primary">
                  {t.adminCompliance.detailEyebrow}
                </p>
                <h2 id="compliance-detail-title" className="mt-1 truncate text-xl font-bold text-foreground">
                  {selected.user.orgName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.user.name} · {selected.user.email}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {selected.user.orgType && (
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {t.adminCompliance.orgType}: {selected.user.orgType}
                    </span>
                  )}
                  {selected.user.county && (
                    <span className="rounded-full bg-muted px-2 py-0.5">{selected.user.county}</span>
                  )}
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    {format(t.adminCompliance.reportsSubmitted, { count: selected.reportCount })}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label={t.adminCompliance.closeDetail}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex items-center gap-4 rounded-xl bg-muted/40 p-4 ring-1 ring-border/60">
                <ProgressRing
                  percent={selected.checklist.percent}
                  tier={checklistTier(selected.checklist.percent, selected.checklist.started)}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {format(t.adminCompliance.checklistComplete, {
                      done: selected.checklist.completed,
                      total: selected.checklist.total,
                    })}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.adminCompliance.lastUpdated}: {formatWhen(selected.checklist.updatedAt)}
                  </p>
                </div>
              </div>

              {selected.assessment && (
                <div className="mt-6 rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t.adminCompliance.selfAssessment}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-creco-primary">
                    {selected.assessment.percent}%
                    <span className="ml-2 text-sm font-semibold capitalize text-muted-foreground">
                      {selected.assessment.band}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {selected.assessment.summary}
                  </p>
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t.adminCompliance.domainBreakdown}
                    </p>
                    {Object.entries(selected.assessment.byDomain).map(([domain, score]) => {
                      const maxDomain = ASSESSMENT_QUESTIONS.filter((q) => q.domain === domain).length * 2;
                      const percent = maxDomain ? Math.round((score / maxDomain) * 100) : 0;
                      return (
                        <div key={domain}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-medium text-foreground">{domain}</span>
                            <span className="tabular-nums text-muted-foreground">{percent}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-creco-primary"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-6">
                {CHECKLIST_SECTIONS.map((section) => {
                  const sectionProgress = selected.checklist.sections.find((s) => s.id === section.id);
                  return (
                    <div key={section.id}>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-creco-primary">{section.title}</h3>
                        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                          {sectionProgress?.completed ?? 0}/{sectionProgress?.total ?? section.items.length}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {section.items.map((item) => {
                          const done = Boolean(selected.checklist.items[item.id]);
                          return (
                            <li
                              key={item.id}
                              className={cn(
                                "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
                                done
                                  ? "border-creco-primary/20 bg-creco-green-muted/50"
                                  : "border-border bg-background",
                              )}
                            >
                              <CheckCircle2
                                className={cn(
                                  "mt-0.5 size-4 shrink-0",
                                  done ? "text-creco-primary" : "text-muted-foreground/40",
                                )}
                                aria-hidden
                              />
                              <span className={cn(done && "text-muted-foreground line-through")}>
                                {item.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
