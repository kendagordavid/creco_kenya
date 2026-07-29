import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { listSourceDocuments } from "@/lib/wiki-server";

export const metadata = {
  title: "Sources",
};

export default async function SourcesPage() {
  const sources = listSourceDocuments();

  return (
    <>
      <PageHero
        eyebrow="Document library"
        title="Approved source materials"
        lead="Topic pages are compiled from these PBO Act documents. In production, CRECO controls which materials are included and when they are updated."
      />
      <SectionSubnav />
      <section className="creco-section creco-section-alt">
        <div className="creco-container relative z-10">
          {sources.length === 0 ? (
            <div className="creco-card p-10 text-center">
              <p className="text-creco-muted">No sources listed.</p>
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
                    View PDF
                    <span aria-hidden>↗</span>
                  </a>
                </article>
              ))}
            </div>
          )}

          <aside className="creco-card mt-12 overflow-hidden p-0">
            <div className="creco-brand-stripe" aria-hidden />
            <div className="p-7">
              <h3 className="text-lg font-bold text-creco-black">Document control</h3>
              <p className="mt-3 text-sm leading-relaxed text-creco-muted">
                Only CRECO-approved materials are compiled into topic pages. Staff can add Kiswahili
                summaries, plain-language guides, and updated regulations as they become available.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
