import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKeyFromRequest } from "@/lib/report-rate-limit";
import { subscribeToNews } from "@/lib/store";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_SIGNUPS = 5;
const hits = new Map<string, number[]>();

const schema = z.object({
  email: z.string().trim().email().max(254),
  consent: z.literal(true),
  locale: z.enum(["en", "sw"]).default("en"),
});

/** In-memory limit so one connection cannot add addresses in bulk. */
function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_SIGNUPS;
}

export async function POST(request: Request) {
  if (rateLimited(clientKeyFromRequest(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    await subscribeToNews(parsed.data.email, parsed.data.locale);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "News subscribe failed");
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
