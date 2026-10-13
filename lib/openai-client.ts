import "server-only";

import { chatEndpoints } from "./openai-config";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function chatCompletion(
  messages: ChatMessage[],
  temperature = 0.25,
  maxTokens = 240,
): Promise<string | null> {
  const endpoints = chatEndpoints();
  if (!endpoints.length) return null;

  for (const endpoint of endpoints) {
    const body: Record<string, unknown> = {
      model: endpoint.model,
      temperature,
      messages,
    };
    body.max_tokens = maxTokens;

    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${endpoint.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) continue;

    const data = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (content) return content;
  }

  return null;
}
