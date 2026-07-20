import { NextResponse } from "next/server";
import { openaiConfigured } from "@/lib/openai-config";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    engine: "llm-wiki",
    answer_mode: openaiConfigured() ? "openai" : "wiki_direct",
    host: "vercel",
  });
}
