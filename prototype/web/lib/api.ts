const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Failed to get an answer");
  }

  return response.json();
}

export async function fetchSources(): Promise<Source[]> {
  try {
    const response = await fetch(`${API_URL}/sources`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.sources ?? [];
  } catch {
    return [];
  }
}

export async function fetchWikiPages(): Promise<WikiPage[]> {
  try {
    const response = await fetch(`${API_URL}/wiki/pages`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.pages ?? [];
  } catch {
    return [];
  }
}
