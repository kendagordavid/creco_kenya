"use client";

import { useId, useRef } from "react";
import { useTranslations } from "@/lib/i18n/client";
import type { GlossaryEntry } from "@/lib/a11y/glossary";

type Props = {
  entry: GlossaryEntry;
  children: React.ReactNode;
};

export function GlossaryTerm({ entry, children }: Props) {
  const t = useTranslations();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  function open() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function close() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline rounded-sm font-semibold text-creco-primary underline decoration-creco-primary/40 underline-offset-2 hover:decoration-creco-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
        <span className="sr-only"> — {t.a11y.glossary.openDefinition}</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed inset-x-4 top-[15%] z-[200] m-0 max-h-[70vh] w-auto max-w-lg overflow-y-auto rounded-xl border border-border bg-background p-0 shadow-xl backdrop:bg-black/50 open:flex open:flex-col sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-lg font-bold text-foreground">
            {entry.term}
          </h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t.a11y.glossary.label}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed text-foreground">{entry.definition}</p>
        </div>
        <div className="border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={close}
            className="creco-btn creco-btn-primary w-full text-sm"
            autoFocus
          >
            {t.a11y.glossary.close}
          </button>
        </div>
      </dialog>
    </>
  );
}
