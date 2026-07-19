"use client";

import { Citation } from "@/lib/api";

type Props = {
  citations: Citation[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
};

export function CitationPanel({ citations, activeIndex, onSelect }: Props) {
  if (citations.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 text-sm text-slate-500">
        Matching wiki pages will appear here when you ask a question.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
        Compiled wiki sources
      </h2>
      {citations.map((citation) => {
        const active = activeIndex === citation.index;
        return (
          <button
            key={`${citation.wiki_slug}-${citation.index}`}
            type="button"
            onClick={() => onSelect(citation.index)}
            className={`w-full rounded-2xl border p-4 text-left transition ${
              active
                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-emerald-300"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                Wiki {citation.index}
              </span>
              <span className="text-xs text-slate-500">
                {Math.round(citation.relevance * 100)}% match
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800">{citation.wiki_title}</p>
            <p className="mt-1 text-xs text-slate-500">slug: {citation.wiki_slug}</p>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-600">
              {citation.excerpt}
            </p>
            {citation.source_url && (
              <a
                href={citation.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 inline-block text-xs font-medium text-emerald-700 hover:underline"
              >
                View original: {citation.source_title}
              </a>
            )}
          </button>
        );
      })}
    </div>
  );
}
