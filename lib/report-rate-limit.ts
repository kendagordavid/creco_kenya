const WINDOW_MS = 60 * 60 * 1000;
const MAX_REPORTS = 5;

const hits = new Map<string, number[]>();

export function clientKeyFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "unknown";
}

/** In-memory limit so a single connection cannot flood the public form. The key is not stored with the report. */
export function isReportRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REPORTS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}
