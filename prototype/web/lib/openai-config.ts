import "server-only";

export function openaiConfigured(): boolean {
  const key = (process.env.OPENAI_API_KEY ?? "").trim();
  if (!key) return false;
  const lowered = key.toLowerCase();
  if (lowered.startsWith("sk-your") || lowered.includes("your-key") || lowered === "changeme") {
    return false;
  }
  return key.startsWith("sk-") && key.length > 20;
}

export function openaiModel(): string {
  return (process.env.OPENAI_MODEL ?? "gpt-4.1-mini").trim() || "gpt-4.1-mini";
}
