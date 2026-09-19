import type { Metadata } from "next";
import Link from "next/link";
import { ModuleCard } from "@/components/ModuleCard";
import { PageHero } from "@/components/PageHero";
import { getCachedWikiSummaries } from "@/lib/cached-wiki";
import { getFaqCategories, getToolkitItems, getMediaItems } from "@/lib/content/locale";
import { interpolate, getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";
import { localizeWikiSummary } from "@/lib/wiki-locale";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.knowledgeHub.metaTitle };
}

export default async function KnowledgeHubPage() {
  const { locale, t } = await getServerTranslations();
  const topics = (await getCachedWikiSummaries()).map((topic) =>
    localizeWikiSummary(topic, locale),
  );
  const faqCategories = getFaqCategories(locale);
  const toolkitItems = getToolkitItems(locale);
  const mediaItems = getMediaItems(locale);
  const filters = [
    { id: "all" as const, href: "/knowledge", label: t.knowledgeHub.filters.all },
    { id: "guides" as const, href: "/knowledge?filter=guides", label: t.knowledgeHub.filters.guides },
    { id: "faqs" as const, href: "/knowledge/faq", label: t.knowledgeHub.filters.faqs },
    { id: "toolkits" as const, href: "/knowledge?filter=toolkits", label: t.knowledgeHub.filters.toolkits },
    { id: "media" as const, href: "/knowledge/media", label: t.knowledgeHub.filters.media },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.knowledgeHub.eyebrow}
        title={t.knowledgeHub.title}
        lead={t.knowledgeHub.lead}
      />
      <section className="creco-section">
        <div className="creco-container">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Link key={filter.id} href={filter.href} className="creco-btn creco-btn-secondary text-sm">
                {filter.label}
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-creco-primary">{t.knowledgeHub.featuredTopics}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <ModuleCard
                  key={topic.slug}
                  title={topic.title}
                  description={topic.tags.join(" · ") || t.topicsPage.compiledGuidance}
                  href={`/knowledge/topics/${topic.slug}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-creco-primary">{t.knowledgeHub.faqCategories}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {faqCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/knowledge/faq?category=${cat.slug}`}
                    className="creco-card block p-5 no-underline"
                  >
                    <h3 className="font-bold text-creco-black">{cat.title}</h3>
                    <p className="mt-1 text-sm text-creco-muted">
                      {interpolate(t.knowledgeHub.questionsCount, { count: String(cat.count) })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-creco-primary">{t.knowledgeHub.toolkitsMedia}</h2>
              <ul className="mt-4 space-y-3">
                {toolkitItems.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/knowledge/toolkits/${item.slug}`} className="font-semibold text-creco-primary no-underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/knowledge/media" className="font-semibold text-creco-primary no-underline">
                    {t.knowledgeHub.filters.media} ({mediaItems.length})
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
