"use client";

import { useEffect, useRef, useState } from "react";
import { askQuestion } from "@/lib/api";
import {
  clearConversation,
  createTurnId,
  formatRelativeTime,
  loadConversation,
  saveConversation,
} from "@/lib/guidance-session";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import { ChatTurn, ChatTurnLoading, Turn } from "./ChatTurn";
import { QuestionComposer } from "./QuestionComposer";
import { SourceReferences } from "./SourceReferences";

type Props = {
  initialQuestion?: string;
  autoOpen?: boolean;
};

function TurnHistoryButton({
  turn,
  index,
  total,
  active,
  onSelect,
}: {
  turn: Turn;
  index: number;
  total: number;
  active: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations();
  const format = useFormat();
  const position = total - index;
  const label =
    position === 1
      ? t.guidancePage.conversation.latest
      : format(t.guidancePage.conversation.questionsAgo, { count: position });

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-creco-green-muted font-semibold text-creco-primary ring-1 ring-creco-primary/20"
          : "text-creco-muted hover:bg-creco-surface hover:text-creco-black"
      }`}
    >
      <span className="flex items-center justify-between gap-2 text-xs">
        <span className={active ? "text-creco-primary" : "text-creco-muted"}>{label}</span>
        <span className={active ? "text-creco-primary/70" : "text-creco-muted/80"}>
          {formatRelativeTime(turn.createdAt)}
        </span>
      </span>
      <span className="mt-1 block line-clamp-2 font-medium">{turn.question}</span>
    </button>
  );
}

export function GuidancePanel({ initialQuestion = "", autoOpen = false }: Props) {
  const t = useTranslations();
  const format = useFormat();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(autoOpen || Boolean(initialQuestion));
  const [activeCitation, setActiveCitation] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const threadEndRef = useRef<HTMLDivElement>(null);
  const composerFocusRef = useRef<(() => void) | null>(null);
  const shouldAutoSubmit = useRef(Boolean(initialQuestion));

  const activeTurn = turns.find((turn) => turn.id === activeTurnId) ?? turns[turns.length - 1] ?? null;
  const hasConversation = turns.length > 0 || Boolean(pendingQuestion);

  useEffect(() => {
    const saved = loadConversation();
    if (saved.length > 0) {
      setTurns(saved);
      setActiveTurnId(saved[saved.length - 1].id);
      setActiveCitation(saved[saved.length - 1].citations[0]?.index ?? null);
      setComposerOpen(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveConversation(turns);
  }, [turns, hydrated]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length, pendingQuestion, loading]);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setPendingQuestion(trimmed);
    setInput("");
    setComposerOpen(true);

    try {
      const result = await askQuestion(trimmed);
      const turn: Turn = {
        id: createTurnId(),
        question: trimmed,
        answer: result.answer,
        citations: result.citations,
        refused: result.refused,
        answer_mode: result.answer_mode,
        createdAt: Date.now(),
      };

      setTurns((prev) => [...prev, turn]);
      setActiveTurnId(turn.id);
      setActiveCitation(result.citations[0]?.index ?? null);
    } catch (error) {
      const turn: Turn = {
        id: createTurnId(),
        question: trimmed,
        answer:
          error instanceof Error
            ? error.message
            : t.guidancePanel.errorFallback,
        citations: [],
        refused: true,
        createdAt: Date.now(),
      };
      setTurns((prev) => [...prev, turn]);
      setActiveTurnId(turn.id);
      setActiveCitation(null);
    } finally {
      setLoading(false);
      setPendingQuestion(null);
      requestAnimationFrame(() => composerFocusRef.current?.());
    }
  }

  useEffect(() => {
    if (!hydrated || !initialQuestion || !shouldAutoSubmit.current) return;
    shouldAutoSubmit.current = false;
    submitQuestion(initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, initialQuestion]);

  function handleSelectTurn(turn: Turn) {
    setActiveTurnId(turn.id);
    setActiveCitation(turn.citations[0]?.index ?? null);
    document.getElementById(`turn-${turn.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleNewConversation() {
    if (loading) return;
    clearConversation();
    setTurns([]);
    setActiveTurnId(null);
    setActiveCitation(null);
    setInput("");
    setPendingQuestion(null);
    setComposerOpen(true);
    requestAnimationFrame(() => composerFocusRef.current?.());
  }

  if (!hydrated) {
    return (
      <div className="creco-card p-8 text-center text-sm text-creco-muted" aria-busy="true">
        {t.guidancePage.conversation.loading}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="flex min-h-[420px] flex-col">
        {hasConversation && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-creco-black">{t.guidancePage.conversation.title}</h2>
              <p className="text-sm text-creco-muted">
                {turns.length === 1
                  ? format(t.guidancePage.conversation.summary, { count: turns.length })
                  : format(t.guidancePage.conversation.summaryPlural, { count: turns.length })}
              </p>
            </div>
            <button
              type="button"
              onClick={handleNewConversation}
              disabled={loading}
              className="creco-btn creco-btn-secondary text-sm disabled:opacity-50"
            >
              {t.guidancePage.conversation.newConversation}
            </button>
          </div>
        )}

        <div className="flex-1 space-y-8">
          {!hasConversation && !loading && (
            <section className="rounded-lg border border-dashed border-creco-border bg-white p-6 text-center text-sm text-creco-muted">
              {t.guidancePage.conversation.empty}
            </section>
          )}

          {turns.map((turn, index) => (
            <ChatTurn
              key={turn.id}
              turn={turn}
              index={index}
              active={turn.id === activeTurn?.id}
              onViewSources={() => handleSelectTurn(turn)}
            />
          ))}

          {loading && pendingQuestion && (
            <ChatTurnLoading question={pendingQuestion} index={turns.length} />
          )}

          <div ref={threadEndRef} aria-hidden />
        </div>

        <div className={`${hasConversation ? "sticky bottom-4 z-10 mt-8" : "mt-6"}`}>
          <QuestionComposer
            value={input}
            onChange={setInput}
            onSubmit={submitQuestion}
            loading={loading}
            autoOpen={autoOpen || composerOpen || hasConversation}
            initialQuestion={initialQuestion}
            followUp={hasConversation}
            focusRef={composerFocusRef}
          />
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        {turns.length > 1 && (
          <nav className="creco-card mb-4 p-4 lg:hidden" aria-label={t.guidancePage.conversation.jumpToQuestion}>
            <p className="text-xs font-bold uppercase tracking-wider text-creco-primary">
              {t.guidancePage.conversation.jumpToQuestion}
            </p>
            <ul className="mt-3 max-h-52 space-y-1 overflow-y-auto">
              {turns.map((turn, index) => (
                <li key={turn.id}>
                  <TurnHistoryButton
                    turn={turn}
                    index={index}
                    total={turns.length}
                    active={turn.id === activeTurn?.id}
                    onSelect={() => handleSelectTurn(turn)}
                  />
                </li>
              ))}
            </ul>
          </nav>
        )}

        <SourceReferences
          citations={activeTurn?.citations ?? []}
          activeIndex={activeCitation}
          onSelect={setActiveCitation}
        />

        {turns.length > 1 && (
          <nav className="creco-card mt-4 hidden p-4 lg:block" aria-label={t.guidancePage.conversation.earlierInChat}>
            <p className="text-xs font-bold uppercase tracking-wider text-creco-primary">
              {t.guidancePage.conversation.earlierInChat}
            </p>
            <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto">
              {[...turns].reverse().map((turn, reverseIndex) => {
                const index = turns.length - 1 - reverseIndex;
                return (
                  <li key={turn.id}>
                    <TurnHistoryButton
                      turn={turn}
                      index={index}
                      total={turns.length}
                      active={turn.id === activeTurn?.id}
                      onSelect={() => handleSelectTurn(turn)}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </aside>
    </div>
  );
}
