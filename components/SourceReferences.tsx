"use client";

import { Citation } from "@/lib/api";
import { useFormat, useTranslations } from "@/lib/i18n/client";

type Props = {
  citations: Citation[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
};

export function SourceReferences({ citations, activeIndex, onSelect }: Props) {
  const t = useTranslations();
  const format = useFormat();

  return (
    <div className="creco-card creco-card-green overflow-hidden p-0">
      <div className="border-b border-creco-border bg-creco-green-muted/50 px-5 py-4">
        <span className="creco-eyebrow !mb-2">{t.sourceReferences.eyebrow}</span>
        <h2 className="font-display text-lg font-bold text-creco-primary">{t.sourceReferences.title}</h2>
      </div>
      <div className="p-5">
        <p className="text-sm text-creco-muted">{t.sourceReferences.lead}</p>

        {citations.length === 0 ? (
          <p className="mt-5 rounded-lg border border-dashed border-creco-border bg-creco-surface/50 px-4 py-6 text-center text-sm text-creco-muted">
            {t.sourceReferences.empty}
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
                    className={`w-full rounded-lg border p-4 text-left transition-all duration-200 ${
                      active
                        ? "border-creco-primary bg-creco-green-muted shadow-sm"
                        : "border-creco-border bg-white hover:border-creco-accent/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-creco-sage">
                        {citation.source_type === "reference"
                          ? t.sourceReferences.reference
                          : t.sourceReferences.topic}{" "}
                        {citation.index}
                      </span>
                      <span className="text-xs text-creco-muted">
                        {format(t.sourceReferences.match, {
                          percent: Math.round(citation.relevance * 100),
                        })}
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
    </div>
  );
}
