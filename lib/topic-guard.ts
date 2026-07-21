import "server-only";

import { chatCompletion } from "./openai-client";
import { openaiConfigured } from "./openai-config";

export type TopicScope = "on_topic" | "off_topic" | "unclear";

const ON_TOPIC_PATTERNS: RegExp[] = [
  /\bpbo\b/i,
  /\bngo\b/i,
  /\bcso\b/i,
  /\bcreco\b/i,
  /\bicnl\b/i,
  /public benefit/i,
  /non[- ]?profit/i,
  /nonprofit/i,
  /registration/i,
  /register/i,
  /sajili/i,
  /mahitaji/i,
  /shirika/i,
  /faida ya umma/i,
  /pbo act/i,
  /organizations act/i,
  /organisations act/i,
  /regulatory authority/i,
  /compliance/i,
  /governance/i,
  /trustee/i,
  /board member/i,
  /civic space/i,
  /civil society/i,
  /kenya.*(act|law|legal)/i,
  /(act|law).{0,20}kenya/i,
  /tax exempt/i,
  /fundraising/i,
  /audit/i,
  /annual return/i,
  /by-?laws/i,
  /constitution/i,
  /memorandum/i,
  /charitable/i,
  /community organis/i,
  /community organiz/i,
];

const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\bweather\b/i,
  /\bfootball\b/i,
  /\bsoccer\b/i,
  /\brecipe\b/i,
  /\bbitcoin\b/i,
  /\bcrypto(currency)?\b/i,
  /\bstock market\b/i,
  /\bwrite (me )?(a )?(poem|story|essay|code)\b/i,
  /\bpython\b/i,
  /\bjavascript\b/i,
  /\bhomework\b/i,
  /\bcapital of\b/i,
  /\bwho (is|was) (the )?(president|king|queen) of (?!kenya)/i,
  /\bdating\b/i,
  /\bmovie\b/i,
  /\bnetflix\b/i,
];

export const OFF_TOPIC_REFUSAL =
  "This tool only answers questions about **Kenyan Public Benefit Organizations**, the **PBO Act**, **NGO/CSO registration and compliance**, and **CRECO-related civic guidance**. Please rephrase your question in that context, browse **Topics**, or contact **CRECO Kenya**.";

export function heuristicTopicScope(question: string, wikiMatchScore: number): TopicScope {
  const q = question.trim();
  if (q.length < 3) return "off_topic";

  if (OFF_TOPIC_PATTERNS.some((re) => re.test(q))) {
    return "off_topic";
  }

  if (wikiMatchScore >= 2) {
    return "on_topic";
  }

  const onHits = ON_TOPIC_PATTERNS.filter((re) => re.test(q)).length;
  if (onHits >= 1) {
    return "on_topic";
  }

  const terms = q.toLowerCase().match(/\w{4,}/g) ?? [];
  const genericNgOHints = ["organization", "organisation", "charity", "foundation", "association"];
  if (terms.some((t) => genericNgOHints.some((h) => t.includes(h)))) {
    return "unclear";
  }

  return "unclear";
}

async function classifyWithModel(question: string): Promise<TopicScope> {
  const reply = await chatCompletion(
    [
      {
        role: "system",
        content: `You gate questions for CRECO Kenya's PBO Act guidance site.
ON TOPIC: Kenya PBO Act 2013, PBO/NGO/CSO registration or compliance, CRECO, ICNL, civic space, nonprofit governance in Kenya.
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

  if (!openaiConfigured()) {
    return wikiMatchScore > 0 ? "on_topic" : "off_topic";
  }

  const modelScope = await classifyWithModel(question);
  if (modelScope !== "unclear") return modelScope;

  return wikiMatchScore > 0 ? "on_topic" : "off_topic";
}
