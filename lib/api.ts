/** Browser-safe API client (no Node.js fs). */
import { CACHE_TTL, peekBrowserCache, writeBrowserCache } from "@/lib/browser-cache";

export function getApiBase(): string {
  const external = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (external) return external;
  return "";
}

function useBuiltInApi(): boolean {
  return !process.env.NEXT_PUBLIC_API_URL;
}

export type Citation = {
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

export type AskResponse = {
  answer: string;
  citations: Citation[];
  confidence: "low" | "medium" | "high";
  refused: boolean;
  answer_mode?: "wiki_direct" | "openai_wiki" | "openai_supplemental";
};

export type Source = {
  id: string;
  title: string;
  url: string;
  type: string;
};

export type WikiPage = {
  slug: string;
  title: string;
  tags: string[];
  related: string[];
};

export async function askQuestion(question: string): Promise<AskResponse> {
  const base = getApiBase();
  const url = useBuiltInApi() ? `${base}/api/ask` : `${base}/ask`;
  const cacheKey = `POST:${url}:${question.trim().toLowerCase()}`;
  const cached = peekBrowserCache<AskResponse>(cacheKey, "local");
  if (cached) return cached;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Failed to get an answer");
  }

  const data = (await response.json()) as AskResponse;
  writeBrowserCache(cacheKey, data, CACHE_TTL.public, "local");
  return data;
}
