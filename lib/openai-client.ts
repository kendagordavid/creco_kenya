import "server-only";

import { openaiConfigured, openaiModel } from "./openai-config";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function chatCompletion(
  messages: ChatMessage[],
  temperature = 0.25,
  maxTokens?: number,
): Promise<string | null> {
  if (!openaiConfigured()) return null;

  const body: Record<string, unknown> = {
    model: openaiModel(),
    temperature,
    messages,
  };
  if (maxTokens != null) body.max_tokens = maxTokens;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}
