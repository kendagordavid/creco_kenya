"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import type { SearchResult } from "@/lib/search";

type Props = {
  query: string;
  results: SearchResult[];
};

export function SearchResults({ query, results }: Props) {
  const t = useTranslations();
  const format = useFormat();
  const liveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!query || !liveRef.current) return;
    const countText =
      results.length === 1
        ? format(t.search.resultsCount, { count: String(results.length), query })
        : format(t.search.resultsCountPlural, { count: String(results.length), query });
    liveRef.current.textContent =
      results.length === 0 ? format(t.search.noResultsTitle, { query }) : countText;
  }, [format, query, results.length, t.search]);

  return (
    <>
      <p ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      {query && (
        <p className="mt-6 text-sm text-creco-muted" aria-hidden="true">
          {results.length === 1
            ? format(t.search.resultsCount, { count: String(results.length), query })
            : format(t.search.resultsCountPlural, { count: String(results.length), query })}
        </p>
      )}

      <section aria-label={t.search.resultsRegion}>
        <ul className="mt-8 space-y-4">
          {results.map((result) => (
            <li key={result.href}>
              <Link
                href={result.href}
                className="creco-card block p-5 no-underline"
                aria-label={format(t.search.readMoreAbout, { title: result.title })}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-creco-accent">
                  {result.type}
                </span>
                <h2 className="mt-1 font-bold text-creco-black dark:text-foreground">{result.title}</h2>
                <p className="mt-2 line-clamp-4 text-sm text-creco-muted">{result.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>

        {query && results.length === 0 && (
          <div className="creco-card mt-8 p-8 text-center" role="status">
            <p className="text-creco-muted">{t.search.noResults}</p>
            <Link href="/guidance?ask=1" className="creco-btn creco-btn-primary mt-4">
              {t.search.askQuestion}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
