import { z } from "zod";
import {
  externalReferrerHost,
  isLikelyBot,
  normalizeTrackedPath,
  recordPageView,
} from "@/lib/page-views";
import { clientKeyFromRequest } from "@/lib/report-rate-limit";

const schema = z.object({
  path: z.string().min(1).max(2048),
  referrer: z.string().max(2048).optional(),
});

const WINDOW_MS = 60 * 1000;
const MAX_VIEWS_PER_WINDOW = 60;
const hits = new Map<string, number[]>();

/** In-memory cap so one connection cannot inflate the counts. */
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  const limited = recent.length >= MAX_VIEWS_PER_WINDOW;
  if (!limited) recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [entry, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(entry);
    }
  }
  return limited;
}

function siteHost(request: Request): string {
  return (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    new URL(request.url).host
  );
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === siteHost(request);
  } catch {
    return false;
  }
}

const done = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

/** Counts one public page view. Always answers 204 so the page never waits on or sees errors. */
export async function POST(request: Request) {
  if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return done();
  if (!isSameOrigin(request)) return done();

  const userAgent = request.headers.get("user-agent") ?? "";
  if (isLikelyBot(userAgent)) return done();

  const ip = clientKeyFromRequest(request);
  if (isRateLimited(ip)) return done();

  try {
    const body = schema.parse(JSON.parse(await request.text()));
    const path = normalizeTrackedPath(body.path);
    if (!path) return done();

    await recordPageView({
      path,
      referrerHost: externalReferrerHost(body.referrer, siteHost(request)),
      ip,
      userAgent,
    });
  } catch (error) {
    if (!(error instanceof z.ZodError) && !(error instanceof SyntaxError)) {
      console.error("[track] could not record page view", error);
    }
  }
  return done();
}
