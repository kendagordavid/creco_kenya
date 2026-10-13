import type { Metadata } from "next";
import Link from "next/link";
import { ModuleCard } from "@/components/ModuleCard";
import { PageHero } from "@/components/PageHero";
import { getCachedWikiSummaries } from "@/lib/cached-wiki";
import { getFaqCategories } from "@/lib/content/locale";
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
  const filters = [
    { id: "summaries", href: "/topics", label: t.nav.menu.frameworkSummaries },
    { id: "faqs", href: "/knowledge/faq", label: t.knowledgeHub.filters.faqs },
    { id: "media", href: "/knowledge/media", label: t.knowledgeHub.filters.media },
    { id: "sources", href: "/sources", label: t.nav.menu.sources },
    { id: "forms", href: "/knowledge/forms", label: t.nav.menu.forms },
    { id: "ask", href: "/guidance", label: t.nav.menu.askGuidance },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.knowledgeHub.eyebrow}
        title={t.knowledgeHub.title}
        lead={t.knowledgeHub.lead}
        backgroundImage="/images/pages/knowledge-discussion.jpg"
        backgroundAlt={t.knowledgeHub.imageAlt}
        backgroundCredit="Photo: Mark Myles Mugambi / Wikimedia Commons"
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
                  description={topic.lead || topic.tags.join(" · ") || t.topicsPage.compiledGuidance}
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
              <h2 className="text-xl font-bold text-creco-primary">{t.nav.menu.sources}</h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/sources" className="font-semibold text-creco-primary no-underline">
                    {t.sources.title}
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge/forms" className="font-semibold text-creco-primary no-underline">
                    {t.formsPage.title}
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge/media" className="font-semibold text-creco-primary no-underline">
                    {t.knowledgeHub.filters.media}
                  </Link>
                </li>
              </ul>
              <p className="mt-6 text-sm text-creco-muted">{t.footer.legalReviewed}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
