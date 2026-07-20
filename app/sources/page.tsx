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
        <div className="creco-container">
          {sources.length === 0 ? (
            <p className="text-creco-muted">No sources listed. Start the backend server.</p>
          ) : (
            <div className="space-y-4">
              {sources.map((source) => (
                <article
                  key={source.id}
                  className="creco-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-medium text-creco-sage">{source.type}</p>
                    <h2 className="mt-1 font-display text-xl font-bold text-creco-primary">
                      {source.title}
                    </h2>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creco-btn creco-btn-primary shrink-0 text-sm"
                  >
                    View PDF
                  </a>
                </article>
              ))}
            </div>
          )}

          <aside className="mt-10 rounded-lg border border-creco-border border-l-4 border-l-creco-sage bg-white p-6">
            <h3 className="font-display text-lg font-bold text-creco-primary">Document control</h3>
            <p className="mt-2 text-sm leading-relaxed text-creco-muted">
              Only CRECO-approved materials are compiled into topic pages. Staff can add Kiswahili
              summaries, plain-language guides, and updated regulations as they become available.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
