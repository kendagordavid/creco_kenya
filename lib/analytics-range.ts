export const ANALYTICS_TIMEZONE = "Africa/Nairobi";
export const MAX_ANALYTICS_DAYS = 366;

export type AnalyticsGrain = "day" | "week" | "month";
export type AnalyticsPreset = "7d" | "30d" | "90d" | "month" | "quarter" | "year";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function todayInNairobi(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ANALYTICS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  if (!ISO_DATE.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

export function addCalendarDays(iso: string, days: number): string {
  const parts = parseIso(iso);
  if (!parts) throw new Error("Invalid date");
  const date = new Date(Date.UTC(parts.y, parts.m - 1, parts.d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function inclusiveDays(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000) + 1;
}

export function presetRange(
  preset: AnalyticsPreset,
  today = todayInNairobi(),
): { from: string; to: string } {
  const [year, month] = today.split("-").map(Number);
  if (preset === "7d") return { from: addCalendarDays(today, -6), to: today };
  if (preset === "30d") return { from: addCalendarDays(today, -29), to: today };
  if (preset === "90d") return { from: addCalendarDays(today, -89), to: today };
  if (preset === "month") return { from: `${today.slice(0, 7)}-01`, to: today };
  if (preset === "year") return { from: `${year}-01-01`, to: today };
  const quarterStart = Math.floor((month - 1) / 3) * 3 + 1;
  return { from: `${year}-${String(quarterStart).padStart(2, "0")}-01`, to: today };
}

export function previousRange(from: string, to: string): { from: string; to: string } {
  const days = inclusiveDays(from, to);
  const toDate = addCalendarDays(from, -1);
  return { from: addCalendarDays(toDate, -(days - 1)), to: toDate };
}

export function suggestGrain(from: string, to: string): AnalyticsGrain {
  const days = inclusiveDays(from, to);
  if (days <= 45) return "day";
  if (days <= 180) return "week";
  return "month";
}

export function isAnalyticsGrain(value: string | null): value is AnalyticsGrain {
  return value === "day" || value === "week" || value === "month";
}

export function validateAnalyticsRange(
  from: string,
  to: string,
): { ok: true; from: string; to: string; days: number } | { ok: false; error: string } {
  if (!parseIso(from) || !parseIso(to)) {
    return { ok: false, error: "Use dates in YYYY-MM-DD format." };
  }
  if (from > to) {
    return { ok: false, error: "Start date must be on or before the end date." };
  }
  const days = inclusiveDays(from, to);
  if (days > MAX_ANALYTICS_DAYS) {
    return { ok: false, error: "Choose a range of 366 days or fewer." };
  }
  return { ok: true, from, to, days };
}

export function bucketStart(iso: string, grain: AnalyticsGrain): string {
  if (grain === "month") return `${iso.slice(0, 7)}-01`;
  if (grain === "day") return iso;
  const parts = parseIso(iso);
  if (!parts) return iso;
  const date = new Date(Date.UTC(parts.y, parts.m - 1, parts.d));
  const weekday = date.getUTCDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  date.setUTCDate(date.getUTCDate() + diff);
  return date.toISOString().slice(0, 10);
}

export function enumerateBuckets(from: string, to: string, grain: AnalyticsGrain): string[] {
  const end = bucketStart(to, grain);
  const buckets: string[] = [];
  let cursor = bucketStart(from, grain);

  while (cursor <= end && buckets.length < 400) {
    buckets.push(cursor);
    if (grain === "month") {
      const [year, month] = cursor.split("-").map(Number);
      cursor =
        month === 12
          ? `${year + 1}-01-01`
          : `${year}-${String(month + 1).padStart(2, "0")}-01`;
    } else {
      cursor = addCalendarDays(cursor, grain === "week" ? 7 : 1);
    }
  }

  return buckets;
}
