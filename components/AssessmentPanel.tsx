"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ASSESSMENT_QUESTIONS, ASSESSMENT_STORAGE_KEY } from "@/lib/content/assessment";
import { loadPersistedData, savePersistedData } from "@/lib/persist-user-data";

export function AssessmentPanel() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);

  useEffect(() => {
    let active = true;
    void loadPersistedData<Record<string, number>>(ASSESSMENT_STORAGE_KEY, sessionStorage).then(
      (saved) => {
        if (active && saved) setAnswers(saved);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const question = ASSESSMENT_QUESTIONS[step];
  const isLast = step === ASSESSMENT_QUESTIONS.length - 1;

  function select(value: number) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    void savePersistedData(ASSESSMENT_STORAGE_KEY, next, sessionStorage);
  }

  function nextStep() {
    if (answers[question.id] === undefined) return;
    if (isLast) {
      router.push("/compliance/assessment/results");
      return;
    }
    setStep((s) => s + 1);
  }

  function prevStep() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="creco-card mx-auto max-w-2xl p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-creco-muted">
        Question {step + 1} of {ASSESSMENT_QUESTIONS.length} · {question.domain}
      </p>
      <h2 className="mt-3 text-xl font-bold text-creco-black">{question.prompt}</h2>

      <div className="mt-6 space-y-3">
        {question.options.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
              answers[question.id] === option.value
                ? "border-creco-primary bg-creco-green-muted"
                : "border-creco-border hover:border-creco-primary/40"
            }`}
          >
            <input
              type="radio"
              name={question.id}
              checked={answers[question.id] === option.value}
              onChange={() => select(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 0}
          className="creco-btn creco-btn-secondary text-sm"
        >
          Back
        </button>
        <div className="flex gap-3">
          <Link href="/compliance/assessment" className="creco-btn creco-btn-ghost-nav text-sm">
            Exit
          </Link>
          <button
            type="button"
            onClick={nextStep}
            disabled={answers[question.id] === undefined}
            className="creco-btn creco-btn-primary text-sm"
          >
            {isLast ? "See results" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
