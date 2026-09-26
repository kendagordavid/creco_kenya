import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { loadAdminAnalytics } from "@/lib/admin-analytics";
import { canViewAllReports } from "@/lib/authz";
import {
  isAnalyticsGrain,
  presetRange,
  suggestGrain,
  validateAnalyticsRange,
} from "@/lib/analytics-range";

function readRange(request: Request) {
  const url = new URL(request.url);
  const fallback = presetRange("30d");
  const from = url.searchParams.get("from") ?? fallback.from;
  const to = url.searchParams.get("to") ?? fallback.to;
  const validated = validateAnalyticsRange(from, to);
  if (!validated.ok) return validated;

  const requestedGrain = url.searchParams.get("grain");
  const grain = isAnalyticsGrain(requestedGrain)
    ? requestedGrain
    : suggestGrain(validated.from, validated.to);

  return { ...validated, grain };
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const range = readRange(request);
  if (!range.ok) {
    return NextResponse.json({ error: range.error }, { status: 400 });
  }

  const analytics = await loadAdminAnalytics(range.from, range.to, range.grain, range.days, {
    includeSeries: false,
  });
  return NextResponse.json(analytics, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
