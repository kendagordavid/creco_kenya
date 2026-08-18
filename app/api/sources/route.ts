import { NextResponse } from "next/server";
import { getCachedSourceDocuments } from "@/lib/cached-wiki";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const sources = await getCachedSourceDocuments();
  return NextResponse.json(
    { sources },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
