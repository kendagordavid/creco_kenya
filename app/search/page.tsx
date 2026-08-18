import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { SearchForm } from "@/components/SearchForm";
import { globalSearch } from "@/lib/search";

export const metadata = {
  title: "Search",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const results = globalSearch(query);

  return (
    <>
      <PageHero
        eyebrow="Search"
        title="Search the platform"
        lead="Topics, FAQs, templates, toolkits, and key pages."
        variant="light"
      />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <SearchForm defaultQuery={query} />

          {query && (
            <p className="mt-6 text-sm text-creco-muted">
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
            </p>
          )}

          <ul className="mt-8 space-y-4">
            {results.map((result) => (
              <li key={result.href}>
                <Link href={result.href} className="creco-card block p-5 no-underline">
                  <span className="text-xs font-bold uppercase tracking-wider text-creco-accent">
                    {result.type}
                  </span>
                  <h2 className="mt-1 font-bold text-creco-black">{result.title}</h2>
                  <p className="mt-2 line-clamp-4 text-sm text-creco-muted">{result.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>

          {query && results.length === 0 && (
            <div className="creco-card mt-8 p-8 text-center">
              <p className="text-creco-muted">No matches. Try the guidance tool or browse the knowledge hub.</p>
              <Link href="/guidance?ask=1" className="creco-btn creco-btn-primary mt-4">
                Ask a question
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
