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
  ["wiki-pages-v2"],
  { revalidate: WIKI_REVALIDATE_SECONDS, tags: ["wiki"] },
);

export const getCachedSourceDocuments = unstable_cache(
  async () => listSourceDocuments(),
  ["wiki-sources"],
  { revalidate: WIKI_REVALIDATE_SECONDS, tags: ["wiki"] },
);

export const getCachedWikiSummaries = unstable_cache(
  async () => listWikiPageSummaries(),
  ["wiki-summaries-v2"],
  { revalidate: WIKI_REVALIDATE_SECONDS, tags: ["wiki"] },
);

export async function getCachedWikiPageBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const pages = await loadWikiPages();
      return pages.find((page) => page.slug === slug) ?? null;
    },
    ["wiki-page-v2", slug],
    { revalidate: WIKI_REVALIDATE_SECONDS, tags: ["wiki", `wiki:${slug}`] },
  )();
}
