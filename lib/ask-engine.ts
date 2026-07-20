import "server-only";

import { chatCompletion } from "./openai-client";
import { openaiConfigured } from "./openai-config";
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

const WIKI_SYSTEM = `You are the CRECO Kenya PBO Act assistant. Answer using the compiled wiki pages provided.

Rules:
1. Ground answers in the wiki content. Cite pages inline as [Wiki: slug].
2. Use plain language for NGO staff who are not lawyers.
3. End with a brief note that this is informational guidance, not legal advice.
4. If asked in Kiswahili, respond in Kiswahili when the wiki supports it.`;

const SUPPLEMENTAL_SYSTEM = `You are the CRECO Kenya PBO Act assistant. The user's question did not match the compiled CRECO topic library well enough for a direct excerpt.

Rules:
1. Answer helpfully about Kenya's Public Benefit Organization Act 2013 and NGO/PBO registration practice in Kenya.
2. Clearly separate: (a) what is general public/legal context vs (b) what they should verify with CRECO Kenya or a lawyer.
3. Prefer referencing: the PBO Act 2013 (Kenya), the Public Benefit Organizations Regulatory Authority, and ICNL civic freedom resources when relevant.
4. Do NOT invent section numbers or quotes. If unsure, say so.
5. End with a brief note that this is informational guidance, not legal advice, and that CRECO's compiled materials remain authoritative for this platform.`;

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
    source_url: "https://creco-kenya.vercel.app/",
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
  return chatCompletion([
    { role: "system", content: WIKI_SYSTEM },
    {
      role: "user",
      content: `Question: ${question}\n\nCompiled wiki pages:\n\n${formatWikiContext(pages)}\n\nProvide a helpful answer citing [Wiki: slug] markers.`,
    },
  ]);
}

async function generateSupplementalAnswer(question: string, weakPages: WikiPage[]): Promise<string | null> {
  const partial =
    weakPages.length > 0
      ? `\n\nPartially related compiled topics (use only if truly relevant):\n${formatWikiContext(weakPages.slice(0, 2))}`
      : "";

  return chatCompletion([
    { role: "system", content: SUPPLEMENTAL_SYSTEM },
    {
      role: "user",
      content: `Question: ${question}\n\nTopics available in the CRECO compiled library:\n${topicCatalog()}${partial}\n\nThe question is not fully covered by those topics. Provide a careful, general answer and tell the user to confirm details with CRECO or legal counsel.`,
    },
  ]);
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

  if (openaiConfigured()) {
    const ai = await generateSupplementalAnswer(trimmed, pages);
    if (ai) {
      const supplementalNote =
        "\n\n*This response draws on general PBO Act context where your question is not fully covered in CRECO’s compiled topic library. Verify important steps with CRECO Kenya.*";
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
      openaiConfigured()
        ? "We couldn't generate an answer right now. Please try again, browse topics, or contact CRECO Kenya."
        : "I couldn't find a matching topic in the compiled PBO Act wiki for that question. Add an OpenAI API key on the server for broader answers, rephrase your question, browse topics, or contact CRECO Kenya.",
    citations: [],
    confidence: "low",
    refused: true,
    answer_mode: "wiki_direct",
  };
}
