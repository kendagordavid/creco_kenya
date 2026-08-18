import { NextResponse } from "next/server";
import { getCachedWikiSummaries } from "@/lib/cached-wiki";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const pages = await getCachedWikiSummaries();
  return NextResponse.json(
    { pages },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
