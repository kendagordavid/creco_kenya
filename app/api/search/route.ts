import { NextResponse } from "next/server";
import { globalSearch } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = globalSearch(q);
  return NextResponse.json({ query: q, results });
}
