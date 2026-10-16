import "server-only";

import { chatCompletion } from "./openai-client";
import { chatConfigured } from "./openai-config";
import { heuristicTopicScope, isOffTopicQuestion, type TopicScope } from "./topic-scope";

export type { TopicScope };
export { heuristicTopicScope, isOffTopicQuestion };

export const OFF_TOPIC_REFUSAL =
  "I'm sorry — I can't answer questions outside the **Public Benefit Organizations Act, 2013** and related PBO registration and compliance in Kenya. Please ask about the PBO Act, registration, or compliance, browse **Topics**, or contact **Mashariki Law**.";

export const NO_GUIDANCE_REFUSAL =
  "I don't have specific guidance on that PBO Act topic yet. Try rephrasing with terms like registration, compliance, or the regulatory authority, browse **Topics**, or contact **Mashariki Law** for help.";

async function classifyWithModel(question: string): Promise<TopicScope> {
  const reply = await chatCompletion(
    [
      {
        role: "system",
        content: `You gate questions for Mashariki Law's PBO Act guidance site.
ON TOPIC: Kenya PBO Act 2013, PBO/NGO/CSO registration or compliance, Mashariki Law, ICNL, civic space, nonprofit governance in Kenya.
OFF TOPIC: all other subjects (other countries, general trivia, tech help, entertainment, unrelated personal advice).
Reply with exactly one word: ON or OFF.`,
      },
      { role: "user", content: question.slice(0, 500) },
    ],
    0,
    8,
  );

  if (!reply) return "unclear";
  const normalized = reply.trim().toUpperCase();
  if (normalized.startsWith("ON")) return "on_topic";
  if (normalized.startsWith("OFF")) return "off_topic";
  return "unclear";
}

/** Decide if we may use AI or supplemental answers (saves tokens on off-topic questions). */
export async function resolveTopicScope(
  question: string,
  wikiMatchScore: number,
): Promise<TopicScope> {
  const heuristic = heuristicTopicScope(question, wikiMatchScore);
  if (heuristic === "on_topic" || heuristic === "off_topic") {
    return heuristic;
  }

  if (!chatConfigured()) {
    return wikiMatchScore > 0 ? "on_topic" : "off_topic";
  }

  const modelScope = await classifyWithModel(question);
  if (modelScope !== "unclear") return modelScope;

  return wikiMatchScore > 0 ? "on_topic" : "off_topic";
}
