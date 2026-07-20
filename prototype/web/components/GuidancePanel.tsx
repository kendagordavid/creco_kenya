"use client";

import { useEffect, useRef, useState } from "react";
import { askQuestion, AskResponse, Citation } from "@/lib/api";
import { AnswerDisplay } from "./AnswerDisplay";
import { AskAnotherButton, QuestionComposer } from "./QuestionComposer";
import { SourceReferences } from "./SourceReferences";

type Exchange = {
  question: string;
  answer: string;
  citations: Citation[];
  refused: boolean;
  answer_mode?: AskResponse["answer_mode"];
};

type Props = {
  initialQuestion?: string;
  autoOpen?: boolean;
};

function answerBadge(mode?: AskResponse["answer_mode"], refused?: boolean) {
  if (refused) return { label: "No answer", tone: "muted" as const };
  if (mode === "openai_wiki") return { label: "AI · compiled topics", tone: "primary" as const };
  if (mode === "openai_supplemental")
    return { label: "AI · general reference", tone: "accent" as const };
  return { label: "Compiled topics", tone: "sage" as const };
}

export function GuidancePanel({ initialQuestion = "", autoOpen = false }: Props) {
  const [input, setInput] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [composerOpen, setComposerOpen] = useState(autoOpen || Boolean(initialQuestion));
  const [activeCitation, setActiveCitation] = useState<number | null>(null);
  const [current, setCurrent] = useState<Exchange | null>(null);
  const [history, setHistory] = useState<Exchange[]>([]);
  const responseRef = useRef<HTMLDivElement>(null);
  const shouldAutoSubmit = useRef(Boolean(initialQuestion));

  const questionDirty = Boolean(
    current && input.trim() && input.trim() !== current.question.trim(),
  );

  useEffect(() => {
    if (current && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [current, loading]);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);

    try {
      const result: AskResponse = await askQuestion(trimmed);
      const exchange: Exchange = {
        question: trimmed,
        answer: result.answer,
        citations: result.citations,
        refused: result.refused,
        answer_mode: result.answer_mode,
      };
      setCurrent(exchange);
      setInput(trimmed);
      setComposerOpen(true);
      setActiveCitation(result.citations[0]?.index ?? null);
      if (!result.refused) {
        setHistory((prev) => [exchange, ...prev.filter((e) => e.question !== trimmed)].slice(0, 5));
      }
    } catch (error) {
      setCurrent({
        question: trimmed,
        answer:
          error instanceof Error
            ? error.message
            : "We could not retrieve an answer at this time. Please try again.",
        citations: [],
        refused: true,
      });
      setInput(trimmed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuestion && shouldAutoSubmit.current) {
      shouldAutoSubmit.current = false;
      submitQuestion(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  function handleAskAnother() {
    setCurrent(null);
    setInput("");
    setComposerOpen(true);
  }

  const showComposer = composerOpen || !current || loading;
  const pinnedComposer = Boolean(current && !loading);
  const badge = current ? answerBadge(current.answer_mode, current.refused) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {showComposer && (
          <QuestionComposer
            value={input}
            onChange={setInput}
            onSubmit={submitQuestion}
            loading={loading}
            autoOpen={autoOpen || composerOpen}
            initialQuestion={initialQuestion}
            pinned={pinnedComposer}
            questionDirty={questionDirty}
            submitLabel={
              current
                ? questionDirty
                  ? "Update answer"
                  : "Ask again"
                : "Get answer"
            }
          />
        )}

        {loading && !current && (
          <section className="creco-card p-6" aria-live="polite" aria-busy="true">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-creco-sage/30 border-t-creco-primary" />
              <p className="text-sm font-semibold text-creco-primary">
                Searching topics and generating your answer…
              </p>
            </div>
            <div className="mt-5 space-y-2">
              <div className="creco-loading-bar h-1.5 w-full" />
              <div className="creco-loading-bar h-1.5 w-4/5 [animation-delay:150ms]" />
              <div className="creco-loading-bar h-1.5 w-3/5 [animation-delay:300ms]" />
            </div>
          </section>
        )}

        {loading && current && (
          <p className="text-sm font-medium text-creco-primary" aria-live="polite">
            Updating your answer…
          </p>
        )}

        {current && (
          <section
            ref={responseRef}
            className={`creco-fade-in space-y-4 ${loading ? "opacity-60" : ""}`}
            aria-busy={loading}
          >
            <article
              className={`creco-card p-5 sm:p-6 ${current.refused ? "!border-l-creco-sand" : "creco-card-featured"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium text-creco-sage">Answer</p>
                {badge && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      badge.tone === "accent"
                        ? "bg-creco-accent/10 text-creco-accent"
                        : badge.tone === "primary"
                          ? "bg-creco-primary/10 text-creco-primary"
                          : badge.tone === "muted"
                            ? "bg-creco-surface-alt text-creco-muted"
                            : "bg-creco-sage/15 text-creco-sage"
                    }`}
                  >
                    {badge.label}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <AnswerDisplay content={current.answer} />
              </div>
              {!current.refused && current.citations.length > 0 && (
                <p className="mt-5 border-t border-creco-border pt-4 text-xs text-creco-muted">
                  {current.answer_mode === "openai_supplemental"
                    ? "References include compiled topics where relevant and general PBO Act resources."
                    : `Grounded in ${current.citations.length} topic reference${current.citations.length === 1 ? "" : "s"}. See panel →`}
                </p>
              )}
            </article>

            <AskAnotherButton onClick={handleAskAnother} />
          </section>
        )}

        {!current && !loading && !composerOpen && (
          <section className="rounded-lg border border-dashed border-creco-border bg-white p-6 text-center text-sm text-creco-muted">
            Open the question form above to get started.
          </section>
        )}

        {history.length > 0 && (
          <section>
            <h3 className="font-display text-lg font-bold text-creco-primary">Recent questions</h3>
            <ul className="mt-3 divide-y divide-creco-border overflow-hidden rounded-lg border border-creco-border bg-white">
              {history.map((item) => (
                <li key={item.question}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrent(item);
                      setInput(item.question);
                      setActiveCitation(item.citations[0]?.index ?? null);
                      setComposerOpen(true);
                    }}
                    className="w-full px-4 py-3 text-left text-sm transition hover:bg-creco-surface"
                  >
                    <span className="font-semibold text-creco-primary">{item.question}</span>
                    <span className="mt-1 block line-clamp-1 text-xs text-creco-muted">
                      {item.answer.replace(/\*\*/g, "")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <SourceReferences
          citations={current?.citations ?? []}
          activeIndex={activeCitation}
          onSelect={setActiveCitation}
        />
      </aside>
    </div>
  );
}
