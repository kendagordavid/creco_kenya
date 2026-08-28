import { NextResponse } from "next/server";
import { PUBLIC_CACHE } from "@/lib/http-cache";
import { globalSearch } from "@/lib/search";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = globalSearch(q);
  return NextResponse.json(
    { query: q, results },
    {
      headers: {
        "Cache-Control": PUBLIC_CACHE.search,
      },
    },
  );
}
