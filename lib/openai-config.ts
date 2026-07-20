import "server-only";

export function openaiConfigured(): boolean {
  return openaiDiagnostic().ready;
}

export function openaiDiagnostic(): { ready: boolean; reason: string | null } {
  const key = (process.env.OPENAI_API_KEY ?? "").trim();
  if (!key) {
    return {
      ready: false,
      reason:
        "OPENAI_API_KEY is not set on the server. In Vercel: Project → Settings → Environment Variables → add OPENAI_API_KEY for Production, then Redeploy.",
    };
  }
  const lowered = key.toLowerCase();
  if (lowered.startsWith("sk-your") || lowered.includes("your-key") || lowered === "changeme") {
    return { ready: false, reason: "OPENAI_API_KEY is a placeholder, not a real key." };
  }
  if (!key.startsWith("sk-") || key.length <= 20) {
    return { ready: false, reason: "OPENAI_API_KEY is set but does not look valid." };
  }
  return { ready: true, reason: null };
}

export function openaiModel(): string {
  return (process.env.OPENAI_MODEL ?? "gpt-4.1-mini").trim() || "gpt-4.1-mini";
}
