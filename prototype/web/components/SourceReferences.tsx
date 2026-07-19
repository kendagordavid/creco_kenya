"use client";

import { Citation } from "@/lib/api";

type Props = {
  citations: Citation[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
};

export function SourceReferences({ citations, activeIndex, onSelect }: Props) {
  return (
    <div className="creco-card p-5">
      <span className="creco-eyebrow">References</span>
      <h2 className="font-display text-lg font-bold text-creco-primary">Source material</h2>
      <p className="mt-2 text-sm text-creco-muted">
        Topic pages and approved documents used to form the guidance response.
      </p>

      {citations.length === 0 ? (
        <p className="mt-5 border-t border-creco-border pt-4 text-sm text-creco-muted">
          References appear here after you submit a question.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {citations.map((citation) => {
            const active = activeIndex === citation.index;
            return (
              <li key={`${citation.wiki_slug}-${citation.index}`}>
                <button
                  type="button"
                  onClick={() => onSelect(citation.index)}
                  className={`w-full rounded-md border p-4 text-left transition ${
                    active
                      ? "border-creco-sage bg-creco-surface"
                      : "border-creco-border bg-white hover:border-creco-primary"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-creco-sage">
                      Topic {citation.index}
                    </span>
                    <span className="text-xs text-creco-muted">
                      {Math.round(citation.relevance * 100)}% match
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-creco-primary">
                    {citation.wiki_title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-creco-muted">
                    {citation.excerpt}
                  </p>
                  {citation.source_url && (
                    <a
                      href={citation.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="mt-3 inline-block text-xs font-semibold text-creco-accent no-underline hover:underline"
                    >
                      {citation.source_title} ↗
                    </a>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
