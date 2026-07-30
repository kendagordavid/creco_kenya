import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";
import { listSourceDocuments } from "@/lib/wiki-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.sources.metaTitle };
}

export default async function SourcesPage() {
  const { t } = await getServerTranslations();
  const sources = listSourceDocuments();

  return (
    <>
      <PageHero
        eyebrow={t.sources.eyebrow}
        title={t.sources.title}
        lead={t.sources.lead}
      />
      <SectionSubnav />
      <section className="creco-section creco-section-alt">
        <div className="creco-container">
          {sources.length === 0 ? (
            <p className="text-creco-muted">{t.sources.empty}</p>
          ) : (
            <div className="space-y-4">
              {sources.map((source, index) => (
                <article
                  key={source.id}
                  className={`creco-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between ${
                    index % 2 === 0 ? "creco-card-green" : "creco-card-accent"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-creco-accent">
                      {source.type}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-creco-black">{source.title}</h2>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creco-btn creco-btn-accent shrink-0 text-sm"
                  >
                    {t.sources.viewPdf}
                  </a>
                </article>
              ))}
            </div>
          )}

          <aside className="mt-10 rounded-xl border border-creco-border bg-white p-6 shadow-sm">
            <div className="h-1 w-12 rounded-full bg-creco-primary mb-4" aria-hidden />
            <h3 className="text-lg font-bold text-creco-black">{t.sources.control.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-creco-muted">{t.sources.control.lead}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
