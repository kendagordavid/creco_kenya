import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { getDictionary, getLocale, getServerTranslations, interpolate } from "@/lib/i18n/server";
import { listWikiPageSummaries } from "@/lib/wiki-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.topics.metaTitle };
}

export default async function TopicsPage() {
  const { t } = await getServerTranslations();
  const wikiPages = listWikiPageSummaries();

  return (
    <>
      <PageHero
        eyebrow={t.topics.eyebrow}
        title={t.topics.title}
        lead={t.topics.lead}
      />
      <SectionSubnav />
      <section className="creco-section">
        <div className="creco-container">
          {wikiPages.length === 0 ? (
            <p className="text-creco-muted">{t.topics.empty}</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {wikiPages.map((page, index) => (
                <article
                  key={page.slug}
                  className={`creco-card flex flex-col p-6 ${index % 2 === 0 ? "creco-card-green" : "creco-card-accent"}`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-creco-primary">
                    {interpolate(t.topics.topicLabel, {
                      number: String(index + 1).padStart(2, "0"),
                    })}
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-creco-black">{page.title}</h2>
                  <p className="mt-3 flex-1 text-sm text-creco-muted">{page.tags.join(" · ")}</p>
                  <Link
                    href={`/guidance?q=${encodeURIComponent(page.title.replace(/\?$/, ""))}`}
                    className="creco-btn creco-btn-primary mt-5 w-fit text-sm"
                  >
                    {t.topics.askAbout}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
