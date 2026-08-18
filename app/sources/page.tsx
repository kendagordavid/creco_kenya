import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { getServerTranslations } from "@/lib/i18n/server";
import { listSourceDocuments } from "@/lib/wiki-server";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
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
