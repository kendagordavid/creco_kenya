import { ANALYTICS_TIMEZONE } from "@/lib/analytics-range";

export function calendarDateInNairobi(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ANALYTICS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Inclusive calendar-day match in Africa/Nairobi. Empty bounds are open. */
export function inDateRange(iso: string, from: string, to: string): boolean {
  if (!from && !to) return true;
  const day = calendarDateInNairobi(iso);
  if (!day) return false;
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}
