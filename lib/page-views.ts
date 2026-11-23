import "server-only";
import { createHmac } from "crypto";
import { todayInNairobi } from "@/lib/analytics-range";
import { getAuthSecret } from "@/lib/auth-env";
import { getSql } from "@/lib/db";

const MAX_PATH_LENGTH = 300;

/** Paths that are not public pages, or that only staff see. */
const EXCLUDED_PREFIXES = ["/admin", "/api", "/_next"];

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime|monitor|facebookexternalhit|whatsapp|telegram|curl|wget|python|axios|node-fetch|go-http/i;

let tableReady: Promise<void> | null = null;

/** Creates the table on first use, so deployments that never re-ran db:setup still work. */
export function ensurePageViewsTable(): Promise<void> {
  if (!tableReady) {
    const sql = getSql();
    tableReady = sql
      .unsafe(`
        CREATE TABLE IF NOT EXISTS page_views (
          id BIGSERIAL PRIMARY KEY,
          viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          path TEXT NOT NULL,
          visitor_id TEXT NOT NULL,
          referrer_host TEXT
        );
        CREATE INDEX IF NOT EXISTS page_views_viewed_at_idx ON page_views (viewed_at DESC);
      `)
      .then(() => undefined)
      .catch((error: unknown) => {
        tableReady = null;
        throw error;
      });
  }
  return tableReady;
}

export function isLikelyBot(userAgent: string): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

/** Returns a clean pathname to record, or null when the path should not be counted. */
export function normalizeTrackedPath(raw: string): string | null {
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  const path = raw.split(/[?#]/)[0].slice(0, MAX_PATH_LENGTH);
  if (EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return null;
  }
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/** The referring site's host name, or null when there is none or it is this site. */
export function externalReferrerHost(referrer: string | undefined, siteHost: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    const own = siteHost.toLowerCase().split(":")[0].replace(/^www\./, "");
    if (!host || host === own) return null;
    return host.slice(0, 200);
  } catch {
    return null;
  }
}

/**
 * A daily visitor ID: an HMAC of the date, IP address and browser, keyed with AUTH_SECRET.
 * The same browser gets the same ID all day and a new one the next day, so we can count
 * unique visitors per day without cookies and without storing the IP address.
 */
function dailyVisitorId(ip: string, userAgent: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${todayInNairobi()}|${ip}|${userAgent}`)
    .digest("hex")
    .slice(0, 32);
}

export async function recordPageView(input: {
  path: string;
  referrerHost: string | null;
  ip: string;
  userAgent: string;
}): Promise<boolean> {
  const secret = getAuthSecret();
  if (!secret) return false;

  await ensurePageViewsTable();
  const sql = getSql();
  await sql`
    INSERT INTO page_views (path, visitor_id, referrer_host)
    VALUES (${input.path}, ${dailyVisitorId(input.ip, input.userAgent, secret)}, ${input.referrerHost})
  `;
  return true;
}
