import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { getCachedSourceDocuments, getCachedWikiSummaries } from "@/lib/cached-wiki";
import { getServerTranslations } from "@/lib/i18n/server";
import { localizeWikiSummary } from "@/lib/wiki-locale";

export const revalidate = 3600;

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return { title: t.sources.metaTitle };
}

export default async function SourcesPage() {
  const { locale, t } = await getServerTranslations();
  const sources = await getCachedSourceDocuments();
  const summaries = (await getCachedWikiSummaries()).map((page) =>
    localizeWikiSummary(page, locale),
  );

  return (
    <>
      <PageHero
        eyebrow={t.sources.eyebrow}
        title={t.sources.title}
        lead={t.sources.lead}
        backgroundImage="/images/pages/sources-archive.jpg"
        backgroundAlt={t.sources.imageAlt}
        backgroundCredit="Photo: Ahmedshayo14 / Wikimedia Commons"
      />
      <section className="creco-section creco-section-alt">
        <div className="creco-container relative z-10">
          {sources.length === 0 ? (
            <div className="creco-card p-10 text-center">
              <p className="text-creco-muted">{t.sources.empty}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sources.map((source, index) => (
                <article
                  key={source.id}
                  className={`creco-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between ${
                    index % 2 === 0 ? "creco-card-green" : "creco-card-accent"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`creco-card-icon text-lg ${
                        index % 2 === 0 ? "creco-card-icon-green" : "creco-card-icon-orange"
                      }`}
                      aria-hidden
                    >
                      PDF
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-creco-accent">
                        {source.type}
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-creco-black">{source.title}</h2>
                    </div>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creco-btn creco-btn-accent shrink-0 text-sm"
                  >
                    {t.sources.viewPdf}
                    <span aria-hidden>↗</span>
                  </a>
                </article>
              ))}
            </div>
          )}

          <div className="mt-14">
            <h2 className="text-2xl font-bold text-creco-black">{t.sources.summariesTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-creco-muted">
              {t.sources.summariesLead}
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {summaries.map((summary, index) => (
                <article
                  key={summary.slug}
                  className={`creco-card flex flex-col p-7 ${
                    index % 2 === 0 ? "creco-card-green" : "creco-card-accent"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-creco-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-creco-black">{summary.title}</h3>
                  {summary.lead ? (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-creco-muted">{summary.lead}</p>
                  ) : null}
                  <Link
                    href={`/knowledge/topics/${summary.slug}`}
                    className="creco-btn creco-btn-primary mt-6 self-start text-sm"
                  >
                    {t.sources.readSummary}
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <aside className="creco-card mt-12 overflow-hidden p-0">
            <div className="creco-brand-stripe" aria-hidden />
            <div className="p-7">
              <h3 className="text-lg font-bold text-creco-black">{t.sources.disclaimerTitle}</h3>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-creco-muted">
                {t.sources.disclaimer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </aside>

          <aside className="creco-card mt-12 overflow-hidden p-0">
            <div className="creco-brand-stripe" aria-hidden />
            <div className="p-7">
              <h3 className="text-lg font-bold text-creco-black">{t.sources.control.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-creco-muted">
                {t.sources.control.lead}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
