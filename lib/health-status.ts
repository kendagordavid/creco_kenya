import { isAuthSecretConfigured } from "@/lib/auth-env";
import { getGoogleAuthStatus } from "@/lib/auth-oauth";
import { getSql } from "@/lib/db";
import { chatConfigured, chatModel, openaiDiagnostic } from "@/lib/openai-config";

export type HealthStatus = {
  status: "ok" | "degraded";
  engine: string;
  answer_mode: "openai" | "wiki_direct";
  ai_ready: boolean;
  openai_model: string;
  setup_hint: string | null;
  auth_secret_configured: boolean;
  google_auth_status: "disabled" | "misconfigured" | "enabled";
  db_ok: boolean;
  host: "vercel" | "local";
};

export async function getHealthStatus(): Promise<HealthStatus> {
  const ai = openaiDiagnostic();
  const chatReady = chatConfigured();
  const authSecretConfigured = isAuthSecretConfigured();
  let dbOk = false;

  try {
    const sql = getSql();
    await sql`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return {
    status: authSecretConfigured && dbOk ? "ok" : "degraded",
    engine: "llm-wiki",
    answer_mode: chatReady ? "openai" : "wiki_direct",
    ai_ready: chatReady,
    openai_model: chatModel(),
    setup_hint: chatReady ? null : ai.reason,
    auth_secret_configured: authSecretConfigured,
    google_auth_status: getGoogleAuthStatus(),
    db_ok: dbOk,
    host: process.env.VERCEL ? "vercel" : "local",
  };
}
