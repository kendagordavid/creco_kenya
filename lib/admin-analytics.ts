import "server-only";
import {
  ANALYTICS_TIMEZONE,
  enumerateBuckets,
  previousRange,
  type AnalyticsGrain,
} from "@/lib/analytics-range";
import { getSql } from "@/lib/db";

export type AnalyticsSummary = {
  newOrganisations: number;
  submissions: number;
  anonymousReports: number;
  feedback: number;
  checklistUpdates: number;
  assessmentUpdates: number;
};

export type AnalyticsBreakdown = {
  key: string;
  count: number;
};

export type AdminAnalytics = {
  range: {
    from: string;
    to: string;
    grain: AnalyticsGrain;
    timezone: string;
    days: number;
  };
  previousRange: { from: string; to: string };
  summary: AnalyticsSummary;
  previous: AnalyticsSummary;
  series: Array<AnalyticsSummary & { bucket: string }>;
  submissionsByType: AnalyticsBreakdown[];
  submissionsByStatus: AnalyticsBreakdown[];
  submissionsByCounty: AnalyticsBreakdown[];
  anonymousByCategory: AnalyticsBreakdown[];
  anonymousByStatus: AnalyticsBreakdown[];
};

type CountRow = { count: number };
type BreakdownRow = { key: string; count: number };
type SeriesRow = { metric: string; bucket: Date | string; count: number };

const METRICS = [
  "newOrganisations",
  "submissions",
  "anonymousReports",
  "feedback",
  "checklistUpdates",
  "assessmentUpdates",
] as const;

function bucketKey(value: Date | string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function emptySummary(): AnalyticsSummary {
  return {
    newOrganisations: 0,
    submissions: 0,
    anonymousReports: 0,
    feedback: 0,
    checklistUpdates: 0,
    assessmentUpdates: 0,
  };
}

async function loadSummary(from: string, to: string): Promise<AnalyticsSummary> {
  const sql = getSql();
  const [organisations, submissions, anonymousReports, feedback, checklist, assessment] =
    await Promise.all([
      sql<CountRow[]>`
        SELECT count(*)::int AS count
        FROM users
        WHERE role = 'pbo_user'
          AND (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      `,
      sql<CountRow[]>`
        SELECT count(*)::int AS count
        FROM submissions
        WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      `,
      sql<CountRow[]>`
        SELECT count(*)::int AS count
        FROM anonymous_reports
        WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      `,
      sql<CountRow[]>`
        SELECT count(*)::int AS count
        FROM feedback
        WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      `,
      sql<CountRow[]>`
        SELECT count(*)::int AS count
        FROM user_data
        WHERE data_key = 'creco-checklist-progress'
          AND (updated_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      `,
      sql<CountRow[]>`
        SELECT count(*)::int AS count
        FROM user_data
        WHERE data_key = 'creco-assessment-answers'
          AND (updated_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      `,
    ]);

  return {
    newOrganisations: organisations[0]?.count ?? 0,
    submissions: submissions[0]?.count ?? 0,
    anonymousReports: anonymousReports[0]?.count ?? 0,
    feedback: feedback[0]?.count ?? 0,
    checklistUpdates: checklist[0]?.count ?? 0,
    assessmentUpdates: assessment[0]?.count ?? 0,
  };
}

export async function loadAdminAnalytics(
  from: string,
  to: string,
  grain: AnalyticsGrain,
  days: number,
  options?: { includeSeries?: boolean },
): Promise<AdminAnalytics> {
  const includeSeries = options?.includeSeries !== false;
  const sql = getSql();
  const prior = previousRange(from, to);

  const [
    summary,
    previous,
    seriesRows,
    submissionsByType,
    submissionsByStatus,
    submissionsByCounty,
    anonymousByCategory,
    anonymousByStatus,
  ] = await Promise.all([
    loadSummary(from, to),
    loadSummary(prior.from, prior.to),
    includeSeries
      ? sql<SeriesRow[]>`
      SELECT 'newOrganisations' AS metric,
             to_char(date_trunc(${grain}, created_at AT TIME ZONE 'Africa/Nairobi'), 'YYYY-MM-DD') AS bucket,
             count(*)::int AS count
      FROM users
      WHERE role = 'pbo_user'
        AND (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY 2
      UNION ALL
      SELECT 'submissions',
             to_char(date_trunc(${grain}, created_at AT TIME ZONE 'Africa/Nairobi'), 'YYYY-MM-DD'),
             count(*)::int
      FROM submissions
      WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY 2
      UNION ALL
      SELECT 'anonymousReports',
             to_char(date_trunc(${grain}, created_at AT TIME ZONE 'Africa/Nairobi'), 'YYYY-MM-DD'),
             count(*)::int
      FROM anonymous_reports
      WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY 2
      UNION ALL
      SELECT 'feedback',
             to_char(date_trunc(${grain}, created_at AT TIME ZONE 'Africa/Nairobi'), 'YYYY-MM-DD'),
             count(*)::int
      FROM feedback
      WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY 2
      UNION ALL
      SELECT 'checklistUpdates',
             to_char(date_trunc(${grain}, updated_at AT TIME ZONE 'Africa/Nairobi'), 'YYYY-MM-DD'),
             count(*)::int
      FROM user_data
      WHERE data_key = 'creco-checklist-progress'
        AND (updated_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY 2
      UNION ALL
      SELECT 'assessmentUpdates',
             to_char(date_trunc(${grain}, updated_at AT TIME ZONE 'Africa/Nairobi'), 'YYYY-MM-DD'),
             count(*)::int
      FROM user_data
      WHERE data_key = 'creco-assessment-answers'
        AND (updated_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY 2
    `
      : Promise.resolve([] as SeriesRow[]),
    sql<BreakdownRow[]>`
      SELECT type AS key, count(*)::int AS count
      FROM submissions
      WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY type
      ORDER BY count DESC, type ASC
    `,
    sql<BreakdownRow[]>`
      SELECT status AS key, count(*)::int AS count
      FROM submissions
      WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY status
      ORDER BY count DESC, status ASC
    `,
    sql<BreakdownRow[]>`
      SELECT county AS key, count(*)::int AS count
      FROM submissions
      WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY county
      ORDER BY count DESC, county ASC
      LIMIT 12
    `,
    sql<BreakdownRow[]>`
      SELECT category AS key, count(*)::int AS count
      FROM anonymous_reports
      WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY category
      ORDER BY count DESC, category ASC
    `,
    sql<BreakdownRow[]>`
      SELECT status AS key, count(*)::int AS count
      FROM anonymous_reports
      WHERE (created_at AT TIME ZONE 'Africa/Nairobi')::date BETWEEN ${from}::date AND ${to}::date
      GROUP BY status
      ORDER BY count DESC, status ASC
    `,
  ]);

  const byBucket = new Map<string, AnalyticsSummary>();
  for (const row of seriesRows) {
    const key = bucketKey(row.bucket);
    const entry = byBucket.get(key) ?? emptySummary();
    if ((METRICS as readonly string[]).includes(row.metric)) {
      entry[row.metric as (typeof METRICS)[number]] = row.count;
    }
    byBucket.set(key, entry);
  }

  const series = includeSeries
    ? enumerateBuckets(from, to, grain).map((bucket) => ({
        bucket,
        ...(byBucket.get(bucket) ?? emptySummary()),
      }))
    : [];

  return {
    range: { from, to, grain, timezone: ANALYTICS_TIMEZONE, days },
    previousRange: prior,
    summary,
    previous,
    series,
    submissionsByType,
    submissionsByStatus,
    submissionsByCounty,
    anonymousByCategory,
    anonymousByStatus,
  };
}

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function csvRow(values: Array<string | number>): string {
  return values.map(csvCell).join(",");
}

export function analyticsToCsv(data: AdminAnalytics): string {
  const lines = [
    csvRow(["CRECO staff analytics"]),
    csvRow(["From", "To", "Timezone", "Grain", "Days"]),
    csvRow([data.range.from, data.range.to, data.range.timezone, data.range.grain, data.range.days]),
    csvRow(["Previous from", "Previous to"]),
    csvRow([data.previousRange.from, data.previousRange.to]),
    "",
    csvRow(["Metric", "Selected period", "Previous period"]),
    csvRow(["New organisations", data.summary.newOrganisations, data.previous.newOrganisations]),
    csvRow(["Monitoring reports", data.summary.submissions, data.previous.submissions]),
    csvRow(["Anonymous reports", data.summary.anonymousReports, data.previous.anonymousReports]),
    csvRow(["Guidance feedback", data.summary.feedback, data.previous.feedback]),
    csvRow(["Checklist updates", data.summary.checklistUpdates, data.previous.checklistUpdates]),
    csvRow(["Assessment updates", data.summary.assessmentUpdates, data.previous.assessmentUpdates]),
    "",
    csvRow([
      "Period start",
      "New organisations",
      "Monitoring reports",
      "Anonymous reports",
      "Guidance feedback",
      "Checklist updates",
      "Assessment updates",
    ]),
    ...data.series.map((point) =>
      csvRow([
        point.bucket,
        point.newOrganisations,
        point.submissions,
        point.anonymousReports,
        point.feedback,
        point.checklistUpdates,
        point.assessmentUpdates,
      ]),
    ),
    "",
    csvRow(["Submission type", "Count"]),
    ...data.submissionsByType.map((row) => csvRow([row.key, row.count])),
    "",
    csvRow(["Submission status", "Count"]),
    ...data.submissionsByStatus.map((row) => csvRow([row.key, row.count])),
    "",
    csvRow(["County", "Reports"]),
    ...data.submissionsByCounty.map((row) => csvRow([row.key, row.count])),
    "",
    csvRow(["Anonymous category", "Count"]),
    ...data.anonymousByCategory.map((row) => csvRow([row.key, row.count])),
    "",
    csvRow(["Anonymous status", "Count"]),
    ...data.anonymousByStatus.map((row) => csvRow([row.key, row.count])),
    "",
  ];

  return `${lines.join("\n")}\n`;
}
