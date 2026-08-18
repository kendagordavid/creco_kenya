"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  ClipboardList,
  FilePlus,
  Loader2,
  MessageCircleQuestion,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { CACHE_TTL } from "@/lib/browser-cache";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import type { Dictionary } from "@/lib/i18n/messages/en";

type Profile = {
  name: string;
  orgName: string;
  county?: string;
};

type Submission = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
};

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

export function DashboardOverview() {
  const t = useTranslations();
  const format = useFormat();
  const { data: profileData, loading: profileLoading } = useAuthQuery<Profile & { error?: string }>(
    "/api/profile",
    { ttlMs: CACHE_TTL.profile },
  );
  const { data: submissionsData, loading: submissionsLoading } = useAuthQuery<{
    submissions?: Submission[];
    error?: string;
  }>("/api/submissions", { ttlMs: CACHE_TTL.submissions });

  const profile = profileData?.error ? null : profileData;
  const submissions = submissionsData?.error ? [] : (submissionsData?.submissions ?? []);
  const loading =
    (profileLoading && !profileData) || (submissionsLoading && !submissionsData);

  const QUICK_LINKS = [
    {
      href: "/monitoring",
      title: t.dashboard.quickActions.submitReport.title,
      description: t.dashboard.quickActions.submitReport.description,
      icon: FilePlus,
      accent: "bg-creco-green-muted text-creco-primary",
    },
    {
      href: "/compliance/checklist",
      title: t.dashboard.quickActions.checklist.title,
      description: t.dashboard.quickActions.checklist.description,
      icon: CheckSquare,
      accent: "bg-creco-green-muted text-creco-primary",
    },
    {
      href: "/guidance?ask=1",
      title: t.dashboard.quickActions.askGuidance.title,
      description: t.dashboard.quickActions.askGuidance.description,
      icon: MessageCircleQuestion,
      accent: "bg-creco-orange-muted text-creco-orange-dark",
    },
    {
      href: "/knowledge",
      title: t.dashboard.quickActions.knowledge.title,
      description: t.dashboard.quickActions.knowledge.description,
      icon: BookOpen,
      accent: "bg-muted text-foreground",
    },
  ] as const;

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const recent = submissions.slice(0, 3);

  return (
    <DashboardShell>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.dashboard.loading}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: t.dashboard.stats.organisation,
                value: profile?.orgName ?? "—",
                sub: profile?.county
                  ? format(t.common.countySuffix, { county: profile.county })
                  : t.dashboard.stats.updateInSettings,
              },
              {
                label: t.dashboard.stats.reportsSubmitted,
                value: String(submissions.length),
                sub:
                  submissions.length === 0
                    ? t.dashboard.stats.noneYet
                    : format(t.dashboard.stats.pendingReview, { count: pendingCount }),
              },
              {
                label: t.dashboard.stats.accountStatus,
                value: t.dashboard.stats.active,
                sub: t.dashboard.stats.registeredUser,
              },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-md ring-1 ring-border/60">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold uppercase tracking-wider">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="text-lg font-bold text-creco-primary">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-bold text-creco-primary">
              {t.dashboard.quickActions.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.dashboard.quickActions.lead}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {QUICK_LINKS.map(({ href, title, description, icon: Icon, accent }) => (
                <Link key={href} href={href} prefetch className="group no-underline">
                  <Card className="h-full border-0 shadow-sm ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                      <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
                      >
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base font-semibold text-foreground group-hover:text-[var(--creco-primary)]">
                          {title}
                        </CardTitle>
                        <CardDescription className="mt-1 leading-relaxed">
                          {description}
                        </CardDescription>
                      </div>
                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--creco-primary)]"
                        aria-hidden
                      />
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <Card className="border-0 shadow-md ring-1 ring-border/60">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg text-creco-primary">
                  <ClipboardList className="size-5" aria-hidden />
                  {t.dashboard.recentSubmissions.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {t.dashboard.recentSubmissions.lead}
                </CardDescription>
              </div>
              <Link
                href="/monitoring/submissions"
                prefetch
                className="inline-flex items-center gap-1 rounded-lg border border-input px-3 py-1.5 text-sm font-medium no-underline transition-colors hover:bg-muted"
              >
                {t.common.viewAll}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <div className="rounded-xl border border-dashed border-creco-border bg-muted/30 px-6 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.recentSubmissions.empty}
                  </p>
                  <Link
                    href="/monitoring"
                    prefetch
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-creco-primary px-4 text-sm font-semibold text-white no-underline transition-colors hover:bg-creco-primary-dark"
                  >
                    {t.dashboard.recentSubmissions.submitFirst}
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-creco-border">
                  {recent.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {typeLabel(t, item.type)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            dateStyle: "medium",
                          })}{" "}
                          · {format(t.common.ref, { id: item.id.slice(0, 8) })}
                        </p>
                      </div>
                      <span
                        className={`creco-status-badge ${
                          item.status === "pending"
                            ? "creco-status-pending"
                            : item.status === "under_review"
                              ? "creco-status-review"
                              : item.status === "approved"
                                ? "creco-status-approved"
                                : "creco-status-rejected"
                        }`}
                      >
                        {statusLabel(t, item.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
