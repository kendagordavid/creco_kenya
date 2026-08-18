"use client";

import { AskResponse, Citation } from "@/lib/api";
import { formatRelativeTime } from "@/lib/guidance-session";
import { useCurrentLocale, useFormat, useTranslations } from "@/lib/i18n/client";
import { AnswerDisplay } from "./AnswerDisplay";

export type Turn = {
  id: string;
  question: string;
  answer: string;
  citations: Citation[];
  refused: boolean;
  answer_mode?: AskResponse["answer_mode"];
  createdAt: number;
};

type Props = {
  turn: Turn;
  active: boolean;
  index: number;
  onViewSources: () => void;
};

function useAnswerBadge(mode?: AskResponse["answer_mode"], refused?: boolean) {
  const t = useTranslations();
  if (refused) return { label: t.guidancePanel.badges.noAnswer, tone: "muted" as const };
  if (mode === "openai_wiki")
    return { label: t.guidancePanel.badges.aiTopics, tone: "primary" as const };
  if (mode === "openai_supplemental")
    return { label: t.guidancePanel.badges.aiReference, tone: "accent" as const };
  return { label: t.guidancePanel.badges.compiledTopics, tone: "sage" as const };
}

export function ChatTurn({ turn, active, index, onViewSources }: Props) {
  const t = useTranslations();
  const format = useFormat();
  const locale = useCurrentLocale();
  const badge = useAnswerBadge(turn.answer_mode, turn.refused);
  const timeOpts = { locale, justNow: t.chatTurn.justNow };

  return (
    <article
      id={`turn-${turn.id}`}
      className={`space-y-3 scroll-mt-28 ${active ? "" : "opacity-90"}`}
      aria-labelledby={`turn-q-${turn.id}`}
    >
      <div className="flex justify-end">
        <div
          className={`max-w-[92%] rounded-2xl rounded-br-md px-4 py-3 sm:max-w-[85%] ${
            active
              ? "bg-creco-primary text-white shadow-md shadow-creco-green/20"
              : "bg-creco-green-muted text-creco-black-soft"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider opacity-75">
            {format(t.chatTurn.youLabel, { number: index + 1 })}
          </p>
          <p id={`turn-q-${turn.id}`} className="mt-1 text-sm font-medium leading-relaxed sm:text-base">
            {turn.question}
          </p>
          <p className={`mt-2 text-[0.65rem] ${active ? "text-white/60" : "text-creco-muted"}`}>
            {formatRelativeTime(turn.createdAt, timeOpts)}
          </p>
        </div>
      </div>

      <div
        className={`creco-card p-5 sm:p-6 transition-all duration-200 ${
          active
            ? turn.refused
              ? "ring-2 ring-creco-accent/30"
              : "creco-card-featured ring-2 ring-creco-primary/15"
            : ""
        } ${turn.refused ? "!border-l-creco-sand" : ""}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-creco-primary">
            {t.guidancePanel.answer}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                badge.tone === "accent"
                  ? "bg-creco-orange-muted text-creco-accent-hover"
                  : badge.tone === "primary"
                    ? "bg-creco-green-muted text-creco-primary"
                    : badge.tone === "muted"
                      ? "bg-creco-surface text-creco-muted"
                      : "bg-creco-green-muted text-creco-primary"
              }`}
            >
              {badge.label}
            </span>
            {!active && turn.citations.length > 0 && (
              <button
                type="button"
                onClick={onViewSources}
                className="text-xs font-semibold text-creco-accent hover:underline"
              >
                {t.chatTurn.viewSources}
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 select-text">
          <AnswerDisplay content={turn.answer} />
        </div>
        {!turn.refused && turn.citations.length > 0 && active && (
          <p className="mt-5 border-t border-creco-border pt-4 text-xs text-creco-muted">
            {turn.answer_mode === "openai_supplemental"
              ? t.guidancePanel.referencesSupplemental
              : format(t.guidancePanel.referencesGrounded, { count: turn.citations.length })}
          </p>
        )}
      </div>
    </article>
  );
}

export function ChatTurnLoading({ question, index }: { question: string; index: number }) {
  const t = useTranslations();
  const format = useFormat();

  return (
    <article className="space-y-3" aria-live="polite" aria-busy="true">
      <div className="flex justify-end">
        <div className="max-w-[92%] rounded-2xl rounded-br-md bg-creco-primary px-4 py-3 text-white shadow-md sm:max-w-[85%]">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
            {format(t.chatTurn.youLabel, { number: index + 1 })}
          </p>
          <p className="mt-1 text-sm font-medium leading-relaxed sm:text-base">{question}</p>
        </div>
      </div>
      <section className="creco-card p-6">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-creco-sage/30 border-t-creco-primary" />
          <p className="text-sm font-semibold text-creco-primary">{t.guidancePanel.searching}</p>
        </div>
        <div className="mt-5 space-y-2">
          <div className="creco-loading-bar h-1.5 w-full" />
          <div className="creco-loading-bar h-1.5 w-4/5 [animation-delay:150ms]" />
          <div className="creco-loading-bar h-1.5 w-3/5 [animation-delay:300ms]" />
        </div>
      </section>
    </article>
  );
}
