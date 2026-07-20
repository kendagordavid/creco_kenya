import { NextResponse } from "next/server";
import { listWikiPageSummaries } from "@/lib/wiki-server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ pages: listWikiPageSummaries() });
}
