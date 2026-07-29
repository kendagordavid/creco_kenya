import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { listWikiPageSummaries } from "@/lib/wiki-server";

export const metadata = {
  title: "Topics",
};

export default async function TopicsPage() {
  const wikiPages = listWikiPageSummaries();

  return (
    <>
      <PageHero
        eyebrow="Knowledge base"
        title="PBO Act topics"
        lead="Structured guidance pages compiled from approved source documents. Each topic can be reviewed and updated by CRECO staff."
      />
      <SectionSubnav />
      <section className="creco-section">
        <div className="creco-container">
          {wikiPages.length === 0 ? (
            <div className="creco-card p-10 text-center">
              <p className="text-creco-muted">No topics available.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {wikiPages.map((page, index) => (
                <article
                  key={page.slug}
                  className={`creco-card flex flex-col p-7 ${index % 2 === 0 ? "creco-card-green" : "creco-card-accent"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-creco-primary">
                      Topic {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`creco-card-icon text-sm ${
                        index % 2 === 0 ? "creco-card-icon-green" : "creco-card-icon-orange"
                      }`}
                      aria-hidden
                    >
                      §
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-creco-black">{page.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-creco-muted">
                    {page.tags.join(" · ")}
                  </p>
                  <Link
                    href={`/guidance?q=${encodeURIComponent(page.title.replace(/\?$/, ""))}`}
                    className="creco-btn creco-btn-primary mt-6 w-fit text-sm"
                  >
                    Ask about this topic
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
