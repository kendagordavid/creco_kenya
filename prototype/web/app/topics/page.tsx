import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { fetchWikiPages } from "@/lib/api";

export const metadata = {
  title: "Topics",
};

export default async function TopicsPage() {
  const wikiPages = await fetchWikiPages();

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
            <p className="text-creco-muted">No topics available. Start the backend server.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {wikiPages.map((page, index) => (
                <article key={page.slug} className="creco-card flex flex-col p-6">
                  <span className="text-xs font-medium text-creco-sage">
                    Topic {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-xl font-bold text-creco-primary">
                    {page.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm text-creco-muted">{page.tags.join(" · ")}</p>
                  <Link
                    href={`/guidance?q=${encodeURIComponent(page.title.replace(/\?$/, ""))}`}
                    className="creco-btn creco-btn-secondary mt-5 w-fit text-sm"
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
