import { unstable_cache } from "next/cache";
import {
  loadWikiPages,
  listSourceDocuments,
  listWikiPageSummaries,
  type WikiPage,
} from "@/lib/wiki-server";

const WIKI_REVALIDATE_SECONDS = 60 * 60;

export const getCachedWikiPages = unstable_cache(
  async (): Promise<WikiPage[]> => loadWikiPages(),
  ["wiki-pages"],
  { revalidate: WIKI_REVALIDATE_SECONDS, tags: ["wiki"] },
);

export const getCachedSourceDocuments = unstable_cache(
  async () => listSourceDocuments(),
  ["wiki-sources"],
  { revalidate: WIKI_REVALIDATE_SECONDS, tags: ["wiki"] },
);

export const getCachedWikiSummaries = unstable_cache(
  async () => listWikiPageSummaries(),
  ["wiki-summaries"],
  { revalidate: WIKI_REVALIDATE_SECONDS, tags: ["wiki"] },
);
