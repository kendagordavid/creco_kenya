import { NextResponse } from "next/server";
import { isAuthSecretConfigured } from "@/lib/auth-env";
import { getSql } from "@/lib/db";
import { PUBLIC_CACHE } from "@/lib/http-cache";
import { openaiDiagnostic, openaiModel } from "@/lib/openai-config";

export const runtime = "nodejs";
export const revalidate = 120;

export async function GET() {
  const ai = openaiDiagnostic();
  const authSecretConfigured = isAuthSecretConfigured();
  let dbOk = false;

  try {
    const sql = getSql();
    await sql`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json(
    {
      status: authSecretConfigured && dbOk ? "ok" : "degraded",
      engine: "llm-wiki",
      answer_mode: ai.ready ? "openai" : "wiki_direct",
      ai_ready: ai.ready,
      openai_model: openaiModel(),
      setup_hint: ai.reason,
      auth_secret_configured: authSecretConfigured,
      db_ok: dbOk,
      host: process.env.VERCEL ? "vercel" : "local",
    },
    {
      headers: {
        "Cache-Control": PUBLIC_CACHE.health,
      },
    },
  );
}
