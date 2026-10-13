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

export type ChatEndpoint = {
  url: string;
  key: string;
  model: string;
  provider: "openai" | "openrouter";
};

function usableKey(key: string): boolean {
  if (!key) return false;
  const lowered = key.toLowerCase();
  return !lowered.startsWith("sk-your") && !lowered.includes("your-key") && lowered !== "changeme";
}

function openrouterKey(): string {
  return (process.env.OPENROUTER_API_KEY ?? process.env.OPENROUTER_TTS_API_KEY ?? "").trim();
}

/** Direct OpenAI first, then OpenRouter's ChatGPT model when that key is the one configured. */
export function chatEndpoints(): ChatEndpoint[] {
  const endpoints: ChatEndpoint[] = [];
  if (openaiConfigured()) {
    endpoints.push({
      url: "https://api.openai.com/v1/chat/completions",
      key: (process.env.OPENAI_API_KEY ?? "").trim(),
      model: openaiModel(),
      provider: "openai",
    });
  }

  const routerKey = openrouterKey();
  if (usableKey(routerKey)) {
    endpoints.push({
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: routerKey,
      model: (process.env.OPENROUTER_CHAT_MODEL ?? "openai/gpt-4.1-mini").trim() || "openai/gpt-4.1-mini",
      provider: "openrouter",
    });
  }

  return endpoints;
}

export function chatConfigured(): boolean {
  return chatEndpoints().length > 0;
}

export function chatModel(): string {
  return chatEndpoints()[0]?.model ?? openaiModel();
}
