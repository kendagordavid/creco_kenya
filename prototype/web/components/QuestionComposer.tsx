"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from "react";

const STARTER_QUESTIONS = [
  "What documents do I need to register as a PBO?",
  "What is a Public Benefit Organization under the PBO Act?",
  "How long does the Authority have to decide on a registration application?",
  "Ni nini mahitaji ya kusajili shirika la faida ya umma?",
];

const MAX_LENGTH = 500;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (question: string) => void;
  loading: boolean;
  autoOpen?: boolean;
  initialQuestion?: string;
  /** Keep form open and allow editing after an answer is shown */
  pinned?: boolean;
  submitLabel?: string;
  questionDirty?: boolean;
};

export function QuestionComposer({
  value,
  onChange,
  onSubmit,
  loading,
  autoOpen = false,
  initialQuestion = "",
  pinned = false,
  submitLabel,
  questionDirty = false,
}: Props) {
  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [expanded, setExpanded] = useState(autoOpen || Boolean(initialQuestion));
  const [hasInteracted, setHasInteracted] = useState(false);

  const openComposer = useCallback(() => {
    setExpanded(true);
    setHasInteracted(true);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (autoOpen || initialQuestion || pinned) {
      openComposer();
    }
  }, [autoOpen, initialQuestion, pinned, openComposer]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !expanded) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }, [value, expanded]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (value.trim() && !loading) {
        onSubmit(value);
      }
    }
  }

  function handleStarterClick(question: string) {
    onChange(question);
    openComposer();
  }

  if (!expanded && !pinned) {
    return (
      <section className="creco-card overflow-hidden p-0">
        <button
          type="button"
          onClick={openComposer}
          className="group flex w-full items-start gap-4 p-6 text-left transition hover:bg-creco-surface/60"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-creco-primary text-white transition group-hover:bg-creco-primary-dark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="flex-1">
            <span className="block font-display text-xl font-bold text-creco-primary">
              Ask your question
            </span>
            <span className="mt-1 block text-sm text-creco-muted">
              Tap to open the question form — write in English or Kiswahili about registration,
              compliance, or the PBO Act.
            </span>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-creco-accent">
              Start writing
              <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </span>
        </button>
      </section>
    );
  }

  return (
    <section
      className={`creco-card creco-fade-in p-5 sm:p-6 ${
        hasInteracted ? "ring-2 ring-creco-sage/25" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="creco-eyebrow">Your question</span>
          <h2 className="font-display text-xl font-bold text-creco-primary sm:text-2xl">
            What would you like to know?
          </h2>
        </div>
        {!pinned && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-md p-2 text-creco-muted transition hover:bg-creco-surface hover:text-creco-primary"
            aria-label="Minimize question form"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-creco-muted">
        {pinned
          ? "Edit your question below and submit again anytime — answers update from CRECO topics and AI when configured."
          : "Be specific for better guidance — e.g. mention registration, timelines, or required documents."}{" "}
        Press <kbd className="rounded border border-creco-border bg-white px-1.5 py-0.5 text-xs">Ctrl</kbd>+
        <kbd className="rounded border border-creco-border bg-white px-1.5 py-0.5 text-xs">Enter</kbd> to submit.
      </p>
      {pinned && questionDirty && (
        <p className="mt-2 text-sm font-medium text-creco-accent" role="status">
          Question changed — submit to get an updated answer.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5">
        <label htmlFor={textareaId} className="sr-only">
          Your question about the PBO Act
        </label>
        <div className="rounded-lg border border-creco-border bg-white focus-within:border-creco-primary focus-within:ring-2 focus-within:ring-creco-sage/20">
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setHasInteracted(true)}
            placeholder="e.g. What documents must our organisation submit when applying for PBO registration under Section 8?"
            rows={4}
            maxLength={MAX_LENGTH}
            disabled={loading}
            className="block w-full resize-none bg-transparent px-4 py-4 text-base leading-relaxed text-creco-text placeholder:text-creco-muted/70 outline-none disabled:opacity-60"
          />
          <div className="flex items-center justify-between gap-3 border-t border-creco-border px-4 py-3">
            <span className="text-xs text-creco-muted">
              {value.length}/{MAX_LENGTH} characters
            </span>
            <button
              type="submit"
              disabled={loading || !value.trim()}
              className="creco-btn creco-btn-primary relative min-w-[140px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Working…
                </span>
              ) : (
                submitLabel ?? "Get answer"
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-5">
        <p className="text-xs font-medium text-creco-muted">Common questions — tap to use</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STARTER_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => handleStarterClick(question)}
              disabled={loading}
              className="rounded-md border border-creco-border bg-creco-surface px-3 py-2 text-left text-xs font-medium text-creco-primary transition hover:border-creco-sage hover:bg-white disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AskAnotherButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="creco-btn creco-btn-secondary w-full sm:w-auto disabled:opacity-50"
    >
      Ask another question
    </button>
  );
}
