"use client";

"use client";

import { Fragment, type ReactNode } from "react";
import { GLOSSARY, GLOSSARY_TERMS_SORTED } from "@/lib/a11y/glossary";
import { GlossaryTerm } from "@/components/GlossaryTerm";
import { useTranslations } from "@/lib/i18n/client";

function linkGlossaryTerms(text: string): ReactNode[] {
  const lower = text.toLowerCase();
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  while (cursor < text.length) {
    let matched: { term: string; index: number } | null = null;

    for (const term of GLOSSARY_TERMS_SORTED) {
      const index = lower.indexOf(term, cursor);
      if (index === -1) continue;
      const before = index > 0 ? lower[index - 1] : " ";
      const after = index + term.length < lower.length ? lower[index + term.length] : " ";
      const isWordBoundary =
        !/[a-z0-9]/i.test(before) && !/[a-z0-9]/i.test(after);
      if (!isWordBoundary) continue;
      if (!matched || index < matched.index) {
        matched = { term, index };
      }
    }

    if (!matched) {
      nodes.push(text.slice(cursor));
      break;
    }

    if (matched.index > cursor) {
      nodes.push(text.slice(cursor, matched.index));
    }

    const entry = GLOSSARY[matched.term];
    const surface = text.slice(matched.index, matched.index + matched.term.length);
    nodes.push(
      <GlossaryTerm key={`glossary-${key++}`} entry={entry}>
        {surface}
      </GlossaryTerm>,
    );
    cursor = matched.index + matched.term.length;
  }

  return nodes;
}

function renderInline(text: string): ReactNode {
  return linkGlossaryTerms(text).map((node, index) => (
    <Fragment key={index}>{node}</Fragment>
  ));
}

export function WikiBody({ body }: { body: string }) {
  const t = useTranslations();
  const blocks = body.split("\n\n");

  return (
    <article className="creco-prose max-w-none">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="mt-6 text-lg font-bold text-creco-black first:mt-0 dark:text-foreground">
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          const heading = trimmed.slice(3);
          const isPlainLanguage = /plain[- ]language|summary|muhtasari/i.test(heading);
          return (
            <h2
              key={index}
              className="mt-8 text-xl font-bold text-creco-primary first:mt-0"
              {...(isPlainLanguage ? { "aria-label": t.a11y.wiki.plainLanguageLabel } : {})}
            >
              {heading}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={index} className="mt-8 text-2xl font-bold first:mt-0">
              {trimmed.slice(2)}
            </h2>
          );
        }

        if (/^plain[- ]language:/i.test(trimmed)) {
          return (
            <aside
              key={index}
              aria-label={t.a11y.wiki.plainLanguageLabel}
              className="mt-4 rounded-lg border border-creco-border bg-creco-green-muted/40 p-4 dark:border-border dark:bg-creco-green-muted/20"
            >
              <p className="text-sm font-semibold text-creco-primary">{t.a11y.wiki.plainLanguageLabel}</p>
              <p className="mt-2 text-sm leading-relaxed">{renderInline(trimmed.replace(/^plain[- ]language:\s*/i, ""))}</p>
            </aside>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <ul key={index} className="mt-3 list-disc space-y-1 pl-5">
              {trimmed.split("\n").map((line) => (
                <li key={line}>{renderInline(line.replace(/^-\s*/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <ol key={index} className="mt-3 list-decimal space-y-1 pl-5">
              {trimmed.split("\n").map((line) => (
                <li key={line}>{renderInline(line.replace(/^\d+\.\s*/, ""))}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className={index > 0 ? "mt-4" : ""}>
            {renderInline(trimmed)}
          </p>
        );
      })}
    </article>
  );
}
