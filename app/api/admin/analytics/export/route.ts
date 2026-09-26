import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { analyticsToCsv, loadAdminAnalytics } from "@/lib/admin-analytics";
import { canViewAllReports } from "@/lib/authz";
import {
  isAnalyticsGrain,
  presetRange,
  suggestGrain,
  validateAnalyticsRange,
} from "@/lib/analytics-range";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const fallback = presetRange("30d");
  const from = url.searchParams.get("from") ?? fallback.from;
  const to = url.searchParams.get("to") ?? fallback.to;
  const validated = validateAnalyticsRange(from, to);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const requestedGrain = url.searchParams.get("grain");
  const grain = isAnalyticsGrain(requestedGrain)
    ? requestedGrain
    : suggestGrain(validated.from, validated.to);

  const analytics = await loadAdminAnalytics(validated.from, validated.to, grain, validated.days);
  const filename = `creco-analytics-${validated.from}-to-${validated.to}.csv`;

  return new NextResponse(analyticsToCsv(analytics), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
