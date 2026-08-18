import Link from "next/link";
import { ModuleCard } from "@/components/ModuleCard";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { KNOWLEDGE_FILTERS } from "@/lib/content/constants";
import { MEDIA_ITEMS, TOOLKIT_ITEMS } from "@/lib/content/knowledge";
import { FAQ_CATEGORIES } from "@/lib/content/faqs";
import { listWikiPageSummaries } from "@/lib/wiki-server";

export const metadata = {
  title: "Knowledge hub",
};

export default function KnowledgeHubPage() {
  const topics = listWikiPageSummaries();

  return (
    <>
      <PageHero
        eyebrow="Legal awareness"
        title="Knowledge hub"
        lead="Plain-language guides, FAQs, toolkits, and media on Kenya's PBO Act — curated by CRECO."
      />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container">
          <div className="flex flex-wrap gap-2">
            {KNOWLEDGE_FILTERS.map((filter) => (
              <Link
                key={filter.id}
                href={
                  filter.id === "all"
                    ? "/knowledge"
                    : filter.id === "faqs"
                      ? "/knowledge/faq"
                      : filter.id === "media"
                        ? "/knowledge/media"
                        : `/knowledge?filter=${filter.id}`
                }
                className="creco-btn creco-btn-secondary text-sm"
              >
                {filter.label}
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-creco-primary">Featured topics</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <ModuleCard
                  key={topic.slug}
                  title={topic.title}
                  description={topic.tags.join(" · ") || "Compiled guidance page"}
                  href={`/knowledge/topics/${topic.slug}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-creco-primary">FAQ categories</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {FAQ_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/knowledge/faq?category=${cat.slug}`}
                    className="creco-card block p-5 no-underline"
                  >
                    <h3 className="font-bold text-creco-black">{cat.title}</h3>
                    <p className="mt-1 text-sm text-creco-muted">{cat.count} questions</p>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-creco-primary">Toolkits & media</h2>
              <ul className="mt-4 space-y-3">
                {TOOLKIT_ITEMS.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/knowledge/toolkits/${t.slug}`} className="font-semibold text-creco-primary no-underline">
                      {t.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/knowledge/media" className="font-semibold text-creco-primary no-underline">
                    Media gallery ({MEDIA_ITEMS.length} items)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
