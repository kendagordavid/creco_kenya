import { NextResponse } from "next/server";
import { getCachedWikiSummaries } from "@/lib/cached-wiki";
import { PUBLIC_CACHE } from "@/lib/http-cache";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const pages = await getCachedWikiSummaries();
  return NextResponse.json(
    { pages },
    {
      headers: {
        "Cache-Control": PUBLIC_CACHE.wiki,
      },
    },
  );
}
