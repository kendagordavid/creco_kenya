import { NextResponse } from "next/server";
import { PUBLIC_CACHE } from "@/lib/http-cache";
import { openaiDiagnostic, openaiModel } from "@/lib/openai-config";

export const runtime = "nodejs";
export const revalidate = 120;

export async function GET() {
  const ai = openaiDiagnostic();
  return NextResponse.json(
    {
      status: "ok",
      engine: "llm-wiki",
      answer_mode: ai.ready ? "openai" : "wiki_direct",
      ai_ready: ai.ready,
      openai_model: openaiModel(),
      setup_hint: ai.reason,
      host: "vercel",
    },
    {
      headers: {
        "Cache-Control": PUBLIC_CACHE.health,
      },
    },
  );
}
