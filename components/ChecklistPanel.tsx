"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  CHECKLIST_INTRO as EN_INTRO,
  CHECKLIST_SECTIONS as EN_SECTIONS,
  CHECKLIST_STORAGE_KEY,
  normalizeChecklistState,
  scoredQuestions,
  sectionsForStatus,
  visibleQuestions,
  type ChecklistAnswer,
  type ChecklistQuestion,
  type ChecklistState,
  type OrgStatus,
} from "@/lib/content/checklist";
import {
  CHECKLIST_INTRO as SW_INTRO,
  CHECKLIST_SECTIONS as SW_SECTIONS,
} from "@/lib/content/sw/checklist";
import { useFormat, useLocale } from "@/lib/i18n/client";
import { loadPersistedData, savePersistedData } from "@/lib/persist-user-data";

function YesNo({
  question,
  answer,
  onAnswer,
  labels,
}: {
  question: ChecklistQuestion;
  answer?: ChecklistAnswer;
  onAnswer: (id: string, answer: ChecklistAnswer) => void;
  labels: { yes: string; no: string };
}) {
  return (
    <div role="radiogroup" aria-label={question.label} className="flex shrink-0 gap-2">
      {(["yes", "no"] as const).map((value) => (
        <label
          key={value}
          className={`flex min-h-11 min-w-16 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
            answer === value
              ? value === "yes"
                ? "border-creco-primary bg-creco-green-muted text-creco-primary"
                : "border-amber-400 bg-amber-50 text-amber-900"
              : "border-creco-border text-creco-muted"
          }`}
        >
          <input
            type="radio"
            name={`checklist-${question.id}`}
            value={value}
            checked={answer === value}
            onChange={() => onAnswer(question.id, value)}
            className="size-4 accent-[var(--creco-primary)]"
          />
          {labels[value]}
        </label>
      ))}
    </div>
  );
}

export function ChecklistPanel() {
  const { locale, t } = useLocale();
  const format = useFormat();
  const copy = t.complianceHub.checklistTool;
  const intro = locale === "sw" ? SW_INTRO : EN_INTRO;
  // Start empty so server and client render the same markup; saved answers load after mount.
  const [state, setState] = useState<ChecklistState>(() => normalizeChecklistState(null));
  const { status, answers } = state;

  const sections = useMemo(
    () => (status ? sectionsForStatus(locale === "sw" ? SW_SECTIONS : EN_SECTIONS, status) : []),
    [locale, status],
  );

  const summary = useMemo(() => {
    let met = 0;
    let required = 0;
    let answered = 0;
    let questions = 0;
    const gaps: ChecklistQuestion[] = [];
    for (const section of sections) {
      const visible = visibleQuestions(section, answers);
      questions += visible.length;
      answered += visible.filter((question) => answers[question.id]).length;
      for (const entry of scoredQuestions(section, answers)) {
        required += 1;
        if (entry.answer === "yes") met += 1;
        if (entry.answer === "no") gaps.push(entry.question);
      }
    }
    return { met, required, answered, questions, gaps };
  }, [sections, answers]);

  const percent = summary.required ? Math.round((summary.met / summary.required) * 100) : 0;

  useEffect(() => {
    let active = true;
    void loadPersistedData<unknown>(CHECKLIST_STORAGE_KEY, localStorage).then((saved) => {
      if (active && saved) setState(normalizeChecklistState(saved));
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!state.status && Object.keys(state.answers).length === 0) return;
    void savePersistedData(CHECKLIST_STORAGE_KEY, state, localStorage);
  }, [state]);

  function chooseStatus(next: OrgStatus) {
    setState((prev) => ({ ...prev, status: next }));
  }

  function answer(id: string, value: ChecklistAnswer) {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [id]: value } }));
  }

  function reset() {
    if (!window.confirm(copy.resetConfirm)) return;
    const cleared: ChecklistState = { version: 2, answers: {} };
    setState(cleared);
    void savePersistedData(CHECKLIST_STORAGE_KEY, cleared, localStorage);
  }

  const yesNoLabels = { yes: copy.yes, no: copy.no };

  function renderQuestion(question: ChecklistQuestion, number: string, nested = false) {
    const value = answers[question.id];
    const isGap = value === "no" && question.kind !== "trigger";
    return (
      <div
        className={`flex flex-col gap-3 py-3 sm:flex-row sm:items-start sm:justify-between ${
          nested ? "ml-4 border-l-2 border-creco-primary/30 pl-4" : ""
        }`}
      >
        <div className="min-w-0 text-sm">
          <p className="creco-break-words font-medium text-creco-black dark:text-foreground">
            <span className="mr-1 font-semibold text-creco-primary">{number}.</span>
            {question.label}
          </p>
          {question.hint && <p className="mt-1 text-xs leading-relaxed text-creco-muted">{question.hint}</p>}
          {isGap && (
            <p className="mt-1 text-xs font-semibold text-amber-800 dark:text-amber-400">{copy.actionNeeded}</p>
          )}
        </div>
        <YesNo question={question} answer={value} onAnswer={answer} labels={yesNoLabels} />
      </div>
    );
  }

  return (
    <div className="creco-print-sheet">
      <div className="creco-print-only">
        <p className="text-sm font-semibold">{copy.printHeader}</p>
        <h1 className="mt-1 text-2xl font-bold">{intro.title}</h1>
      </div>

      <div className="creco-card p-6">
        <p className="text-sm font-semibold text-creco-primary">{intro.legalBasis}</p>
        <h2 className="mt-4 text-base font-bold text-creco-black dark:text-foreground">{copy.purposeTitle}</h2>
        {intro.purpose.map((paragraph) => (
          <p key={paragraph} className="mt-2 text-sm leading-relaxed text-creco-muted">
            {paragraph}
          </p>
        ))}
        <h2 className="mt-4 text-base font-bold text-creco-black dark:text-foreground">{copy.guidanceTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-creco-muted">{intro.guidance}</p>
      </div>

      <fieldset className="creco-card mt-6 p-6">
        <legend className="sr-only">{intro.statusQuestion}</legend>
        <h2 className="text-lg font-bold text-creco-primary">{copy.statusHeading}</h2>
        <p className="mt-2 text-sm font-medium text-creco-black dark:text-foreground">{intro.statusQuestion}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {intro.statusOptions.map((option) => (
            <label
              key={option.value}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                status === option.value
                  ? "border-creco-primary bg-creco-green-muted font-semibold text-creco-primary"
                  : "border-creco-border"
              }`}
            >
              <input
                type="radio"
                name="checklist-status"
                value={option.value}
                checked={status === option.value}
                onChange={() => chooseStatus(option.value)}
                className="size-4 accent-[var(--creco-primary)]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {!status ? (
        <p className="mt-6 text-sm text-creco-muted">{copy.chooseStatus}</p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-creco-black dark:text-foreground">
                {format(copy.score, { done: summary.met, total: summary.required })}
                {summary.required > 0 && ` · ${percent}%`}
              </p>
              <p className="mt-1 text-xs text-creco-muted">
                {format(copy.answered, { answered: summary.answered, total: summary.questions })}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-creco-primary" style={{ width: `${percent}%` }} />
              </div>
            </div>
            <div className="creco-no-print flex gap-2">
              <button type="button" className="creco-btn creco-btn-secondary text-sm" onClick={() => window.print()}>
                {copy.print}
              </button>
              <button type="button" className="creco-btn creco-btn-secondary text-sm" onClick={reset}>
                {copy.reset}
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {sections.map((section) => {
              let lastGroup: string | undefined;
              return (
                <section key={section.id} className="creco-card p-6">
                  <h2 className="text-lg font-bold text-creco-primary">{section.title}</h2>
                  {section.description && (
                    <p className="mt-1 text-sm text-creco-muted">{section.description}</p>
                  )}
                  <div className="mt-2 divide-y divide-creco-border">
                    {section.questions.map((question, index) => {
                      const showGroup = question.group && question.group !== lastGroup;
                      lastGroup = question.group;
                      const number = String(index + 1);
                      return (
                        <Fragment key={question.id}>
                          {showGroup && (
                            <h3 className="pt-4 pb-1 text-xs font-bold uppercase tracking-wider text-creco-muted">
                              {question.group}
                            </h3>
                          )}
                          <div>
                            {renderQuestion(question, number)}
                            {answers[question.id] === "yes" && (question.followUps?.length ?? 0) > 0 && (
                              <div className="pb-2">
                                <p className="ml-4 text-xs font-semibold uppercase tracking-wider text-creco-muted">
                                  {copy.ifYes}
                                </p>
                                {question.followUps?.map((followUp, followIndex) =>
                                  <Fragment key={followUp.id}>
                                    {renderQuestion(followUp, `${number}${String.fromCharCode(97 + followIndex)}`, true)}
                                  </Fragment>,
                                )}
                              </div>
                            )}
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="creco-card mt-6 p-6">
            <h2 className="text-lg font-bold text-creco-primary">{copy.gapsTitle}</h2>
            {summary.gaps.length === 0 ? (
              <p className="mt-2 text-sm text-creco-muted">{copy.noGaps}</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-creco-muted">{copy.gapsLead}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
                  {summary.gaps.map((gap) => (
                    <li key={gap.id} className="creco-break-words">
                      {gap.label}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/guidance"
                  className="creco-no-print mt-4 inline-block text-sm font-semibold text-creco-primary no-underline"
                >
                  {copy.askGuidance}
                </Link>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
