import { NextResponse } from "next/server";
import { unsubscribeFromNews } from "@/lib/store";

/**
 * Unsubscribes by token. Used by the confirm button on /news/unsubscribe and by
 * mail apps' one-click "Unsubscribe" (List-Unsubscribe-Post), which POST here.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const found = await unsubscribeFromNews(token);
  if (!found) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
