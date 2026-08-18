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

export function AdminReportsDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSubmissions(data.submissions ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return submissions;
    return submissions.filter((item) => item.status === statusFilter);
  }, [submissions, statusFilter]);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotice(data.error ?? t.admin.statusFailed);
        return;
      }
      setSubmissions((current) =>
        current.map((item) => (item.id === id ? { ...item, status: data.submission.status } : item)),
      );
      setNotice(t.admin.statusUpdated);
    } catch {
      setNotice(t.admin.statusFailed);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <DashboardShell title={t.admin.title} description={t.admin.description}>
      {loading ? (
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

          {filtered.map((item) => (
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

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-creco-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t.common.referenceId}{" "}
                    <span className="font-mono">{item.id.slice(0, 8)}</span>
                  </p>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-muted-foreground">{t.admin.updateStatus}</span>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
