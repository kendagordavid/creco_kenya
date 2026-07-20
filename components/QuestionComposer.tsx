"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from "react";

const STARTER_QUESTIONS = [
  "What documents do I need to register as a PBO?",
  "What is a Public Benefit Organization under the PBO Act?",
  "How long does the Authority have to decide on a registration application?",
  "Ni nini mahitaji ya kusajili shirika la faida ya umma?",
];

const MAX_LENGTH = 500;
const SINGLE_LINE_MAX_PX = 52;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (question: string) => void;
  loading: boolean;
  autoOpen?: boolean;
  initialQuestion?: string;
  pinned?: boolean;
  submitLabel?: string;
  questionDirty?: boolean;
};

function countLines(text: string): number {
  if (!text) return 1;
  return text.split(/\n/).length;
}

function ExampleQuestions({
  onPick,
  loading,
  compact = false,
}: {
  onPick: (q: string) => void;
  loading: boolean;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "mt-2" : "mt-3"}>
      <p className="text-xs font-medium text-creco-muted">Example questions</p>
      <div className={`mt-1.5 flex flex-wrap ${compact ? "gap-1" : "gap-1.5"}`}>
        {STARTER_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onPick(question)}
            disabled={loading}
            className="rounded border border-creco-border bg-creco-surface px-2 py-1 text-left text-[11px] font-medium leading-snug text-creco-primary transition hover:border-creco-sage hover:bg-white disabled:opacity-50 sm:text-xs sm:px-2.5 sm:py-1.5"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

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
  const [expanded, setExpanded] = useState(autoOpen || Boolean(initialQuestion) || pinned);
  const [multiLine, setMultiLine] = useState(() => countLines(initialQuestion) > 1);

  const openComposer = useCallback(() => {
    setExpanded(true);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  useEffect(() => {
    if (autoOpen || initialQuestion || pinned) {
      setExpanded(true);
    }
  }, [autoOpen, initialQuestion, pinned]);

  useEffect(() => {
    const lines = countLines(value);
    const textarea = textareaRef.current;
    const tall = textarea ? textarea.scrollHeight > SINGLE_LINE_MAX_PX : lines > 1;
    setMultiLine(lines > 1 || tall || value.length > 120);
  }, [value, expanded]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !expanded) return;
    textarea.style.height = "auto";
    const max = multiLine ? 200 : SINGLE_LINE_MAX_PX;
    textarea.style.height = `${Math.min(textarea.scrollHeight, max)}px`;
  }, [value, expanded, multiLine]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      if ((event.metaKey || event.ctrlKey) && value.trim() && !loading) {
        event.preventDefault();
        onSubmit(value);
      }
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (value.trim() && !loading) onSubmit(value);
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
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-creco-surface/60 sm:px-5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-creco-primary text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="min-w-0 flex-1 text-sm text-creco-muted">
            Ask about the PBO Act — registration, compliance, English or Kiswahili…
          </span>
          <span className="shrink-0 text-xs font-semibold text-creco-accent">Ask →</span>
        </button>
        <div className="border-t border-creco-border px-4 pb-3 pt-2 sm:px-5">
          <ExampleQuestions onPick={handleStarterClick} loading={loading} compact />
        </div>
      </section>
    );
  }

  const showMeta = multiLine || pinned;

  return (
    <section className={`creco-card creco-fade-in ${showMeta ? "p-4 sm:p-5" : "p-3 sm:p-4"}`}>
      {!pinned && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-creco-primary sm:text-lg">Your question</h2>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded p-1.5 text-creco-muted transition hover:bg-creco-surface hover:text-creco-primary"
            aria-label="Minimize"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {pinned && questionDirty && (
        <p className="mb-2 text-xs font-medium text-creco-accent" role="status">
          Question changed — submit for an updated answer.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor={textareaId} className="sr-only">
          Your question about the PBO Act
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 rounded-lg border border-creco-border bg-white focus-within:border-creco-primary focus-within:ring-2 focus-within:ring-creco-sage/20">
            <textarea
              ref={textareaRef}
              id={textareaId}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                pinned
                  ? "Edit your question…"
                  : "Ask a question (Shift+Enter for a new line)"
              }
              rows={1}
              maxLength={MAX_LENGTH}
              disabled={loading}
              className="block w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-snug text-creco-text placeholder:text-creco-muted/70 outline-none disabled:opacity-60 sm:text-base sm:px-3.5 sm:py-3"
            />
            {showMeta && (
              <div className="flex items-center justify-between gap-2 border-t border-creco-border px-3 py-1.5 text-xs text-creco-muted">
                <span>
                  {value.length}/{MAX_LENGTH}
                </span>
                <span className="hidden sm:inline">
                  Ctrl+Enter to submit · Shift+Enter for new line
                </span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="creco-btn creco-btn-primary w-full shrink-0 px-4 py-2.5 text-sm sm:w-auto sm:min-w-[7.5rem] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                …
              </span>
            ) : (
              submitLabel ?? "Get answer"
            )}
          </button>
        </div>
      </form>

      <ExampleQuestions onPick={handleStarterClick} loading={loading} compact={pinned} />
    </section>
  );
}

export function AskAnotherButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="creco-btn creco-btn-secondary w-full text-sm sm:w-auto disabled:opacity-50"
    >
      Ask another question
    </button>
  );
}
