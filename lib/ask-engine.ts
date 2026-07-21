import "server-only";

import { chatCompletion } from "./openai-client";
import { openaiConfigured } from "./openai-config";
import { OFF_TOPIC_REFUSAL, resolveTopicScope } from "./topic-guard";
import {
  WikiPage,
  composeAnswer,
  loadWikiPages,
  searchWiki,
} from "./wiki-server";

export type AskCitation = {
  index: number;
  wiki_slug: string;
  wiki_title: string;
  excerpt: string;
  relevance: number;
  source_id: string;
  source_title: string;
  source_url: string;
  source_type: string;
};

export type AskResult = {
  answer: string;
  citations: AskCitation[];
  confidence: "low" | "medium" | "high";
  refused: boolean;
  answer_mode: "wiki_direct" | "openai_wiki" | "openai_supplemental";
};

const WIKI_STRONG_SCORE = 4;

const WIKI_SYSTEM = `You are the CRECO Kenya PBO Act assistant. Answer using ONLY the compiled wiki pages provided.

Rules:
1. Use only facts from the wiki content. Cite pages inline as [Wiki: slug].
2. If the wiki does not contain the answer, say so — do not guess.
3. Use plain language for NGO staff who are not lawyers.
4. End with a brief note that this is informational guidance, not legal advice.
5. If asked in Kiswahili, respond in Kiswahili when the wiki supports it.`;

const SUPPLEMENTAL_SYSTEM = `You are the CRECO Kenya PBO Act assistant. The question is ON TOPIC (Kenyan NGOs/PBOs/CRECO civic space) but not fully covered in the compiled library.

Rules:
1. Answer ONLY about Kenya's PBO Act 2013, NGO/PBO registration, compliance, governance, or CRECO-relevant civic regulation in Kenya.
2. Do NOT answer if the user question is outside that scope — say it is outside CRECO's guidance scope instead.
3. Do NOT invent section numbers or quotes. If unsure, say so and refer to CRECO Kenya or legal counsel.
4. Clearly mark general context vs what must be verified with CRECO or a lawyer.
5. End with a brief note that this is informational guidance, not legal advice.`;

const REFERENCE_CITATIONS: AskCitation[] = [
  {
    index: 1,
    wiki_slug: "pbo-act-2013",
    wiki_title: "Public Benefit Organization Act, 2013 (Kenya)",
    excerpt: "Primary legislation establishing registration and regulation of PBOs in Kenya.",
    relevance: 0.85,
    source_id: "kenya-pbo-act",
    source_title: "PBO Act 2013 — Kenya Law Reform Commission / Kenya Gazette",
    source_url: "https://www.icnl.org/resources/research/kenya-public-benefit-organizations-act",
    source_type: "reference",
  },
  {
    index: 2,
    wiki_slug: "creco-guidance",
    wiki_title: "CRECO Kenya — PBO guidance",
    excerpt: "Contact CRECO for authoritative guidance aligned with your organization's situation.",
    relevance: 0.75,
    source_id: "creco-kenya",
    source_title: "CRECO Kenya",
    source_url: "https://www.crecokenya.org/",
    source_type: "reference",
  },
];

function firstParagraph(body: string): string {
  for (const block of body.split("\n\n")) {
    const cleaned = block.trim();
    if (cleaned && !cleaned.startsWith("#")) return cleaned.slice(0, 400);
  }
  return body.slice(0, 400);
}

function pagesToCitations(pages: WikiPage[]): AskCitation[] {
  return pages.map((page, i) => {
    const src = page.sourceDocuments[0];
    return {
      index: i + 1,
      wiki_slug: page.slug,
      wiki_title: page.title,
      excerpt: firstParagraph(page.body),
      relevance: Math.round(Math.max(0.5, 1 - i * 0.12) * 1000) / 1000,
      source_id: src?.id ?? page.slug,
      source_title: src?.title ?? page.title,
      source_url: src?.url ?? "",
      source_type: "wiki",
    };
  });
}

function wikiMatchScore(question: string, pages: WikiPage[]): number {
  if (!pages.length) return 0;
  const terms = question.toLowerCase().match(/\w{3,}/g) ?? [];
  const primary = pages[0];
  const slugText = primary.slug.replace(/-/g, " ");
  const haystack =
    `${primary.title} ${primary.body} ${primary.tags.join(" ")} ${slugText}`.toLowerCase();
  let score = terms.filter((t) => haystack.includes(t)).length;
  if (terms.some((t) => slugText.includes(t) || primary.title.toLowerCase().includes(t))) {
    score += 3;
  }
  return score;
}

function formatWikiContext(pages: WikiPage[]): string {
  return pages
    .map((page) => `## Wiki page: ${page.title} (slug: ${page.slug})\n\n${page.body}`)
    .join("\n\n---\n\n");
}

function topicCatalog(): string {
  return loadWikiPages()
    .map((p) => `- ${p.title} (${p.slug})`)
    .join("\n");
}

async function generateWikiAnswer(question: string, pages: WikiPage[]): Promise<string | null> {
  return chatCompletion(
    [
      { role: "system", content: WIKI_SYSTEM },
      {
        role: "user",
        content: `Question: ${question}\n\nCompiled wiki pages:\n\n${formatWikiContext(pages)}\n\nProvide a helpful answer citing [Wiki: slug] markers.`,
      },
    ],
    0.2,
  );
}

async function generateSupplementalAnswer(question: string, weakPages: WikiPage[]): Promise<string | null> {
  const partial =
    weakPages.length > 0
      ? `\n\nPartially related compiled topics (use only if truly relevant):\n${formatWikiContext(weakPages.slice(0, 2))}`
      : "";

  return chatCompletion(
    [
      { role: "system", content: SUPPLEMENTAL_SYSTEM },
      {
        role: "user",
        content: `Question: ${question}\n\nTopics in the CRECO compiled library:\n${topicCatalog()}${partial}\n\nGive a short, careful answer only if it stays within Kenyan PBO/NGO/CRECO scope.`,
      },
    ],
    0.2,
  );
}

function offTopicResult(): AskResult {
  return {
    answer: OFF_TOPIC_REFUSAL,
    citations: [],
    confidence: "low",
    refused: true,
    answer_mode: "wiki_direct",
  };
}

export async function askQuestionEngine(question: string): Promise<AskResult> {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      answer: "Please enter a question about the PBO Act.",
      citations: [],
      confidence: "low",
      refused: true,
      answer_mode: "wiki_direct",
    };
  }

  const pages = searchWiki(trimmed);
  const matchScore = wikiMatchScore(trimmed, pages);
  const strongWiki = pages.length > 0 && matchScore >= WIKI_STRONG_SCORE;

  if (strongWiki) {
    const citations = pagesToCitations(pages);
    const confidence = pages.length >= 2 ? "high" : "medium";

    if (openaiConfigured()) {
      const ai = await generateWikiAnswer(trimmed, pages);
      if (ai) {
        return {
          answer: ai,
          citations,
          confidence,
          refused: false,
          answer_mode: "openai_wiki",
        };
      }
    }

    return {
      answer: composeAnswer(pages),
      citations,
      confidence,
      refused: false,
      answer_mode: "wiki_direct",
    };
  }

  const scope = await resolveTopicScope(trimmed, matchScore);
  if (scope === "off_topic") {
    return offTopicResult();
  }

  if (openaiConfigured()) {
    const ai = await generateSupplementalAnswer(trimmed, pages);
    if (ai) {
      const supplementalNote =
        "\n\n*This response uses general Kenyan PBO/NGO context where CRECO’s compiled library does not fully cover your question. Verify important steps with CRECO Kenya.*";
      const answer = ai.includes("not legal advice") ? ai : `${ai}${supplementalNote}`;
      return {
        answer,
        citations: pages.length ? pagesToCitations(pages) : REFERENCE_CITATIONS,
        confidence: pages.length ? "medium" : "low",
        refused: false,
        answer_mode: "openai_supplemental",
      };
    }
  }

  if (pages.length) {
    const citations = pagesToCitations(pages);
    return {
      answer: composeAnswer(pages),
      citations,
      confidence: "medium",
      refused: false,
      answer_mode: "wiki_direct",
    };
  }

  return {
    answer:
      "I couldn't find a matching topic in the compiled library. Try rephrasing with PBO, registration, or compliance terms, browse **Topics**, or contact **CRECO Kenya**.",
    citations: [],
    confidence: "low",
    refused: true,
    answer_mode: "wiki_direct",
  };
}
