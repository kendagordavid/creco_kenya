import { NextResponse } from "next/server";
import { getCachedSourceDocuments } from "@/lib/cached-wiki";
import { PUBLIC_CACHE } from "@/lib/http-cache";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const sources = await getCachedSourceDocuments();
  return NextResponse.json(
    { sources },
    {
      headers: {
        "Cache-Control": PUBLIC_CACHE.wiki,
      },
    },
  );
}
