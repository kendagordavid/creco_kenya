"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, FilePlus, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import type { Dictionary } from "@/lib/i18n/messages/en";

type Submission = {
  id: string;
  type: string;
  status: string;
  county: string;
  narrative: string;
  createdAt: string;
};

const STATUS_CLASS: Record<string, string> = {
  pending: "creco-status-pending",
  under_review: "creco-status-review",
  approved: "creco-status-approved",
  rejected: "creco-status-rejected",
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

export function SubmissionsDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSubmissions(data.submissions ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell
      title={t.dashboard.submissions.title}
      description={t.dashboard.submissions.description}
    >
      {loading ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.dashboard.submissions.loading}
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
            <h3 className="mt-5 text-lg font-bold text-creco-primary">
              {t.dashboard.submissions.emptyTitle}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t.dashboard.submissions.emptyLead}
            </p>
            <Link
              href="/monitoring"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-creco-primary px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-creco-primary-dark"
            >
              <FilePlus className="size-4" aria-hidden />
              {t.dashboard.submissions.submitReport}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {submissions.length === 1
                ? format(t.common.reportCount, { count: submissions.length })
                : format(t.common.reportsCount, { count: submissions.length })}
            </p>
            <Link
              href="/monitoring"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--creco-primary)] no-underline hover:underline"
            >
              {t.dashboard.submissions.newReport}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          {submissions.map((item) => (
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
              <CardContent className="space-y-3 pt-0">
                <p className="text-sm leading-relaxed text-foreground/90">{item.narrative}</p>
                <p className="text-xs font-medium text-muted-foreground">
                  {t.common.referenceId}{" "}
                  <span className="font-mono">{item.id.slice(0, 8)}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
