"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scoreAssessment, ASSESSMENT_STORAGE_KEY } from "@/lib/content/assessment";
import { loadPersistedData } from "@/lib/persist-user-data";

function readAssessmentResult() {
  if (typeof window === "undefined") return null;
  try {
    const saved = sessionStorage.getItem(ASSESSMENT_STORAGE_KEY);
    return saved ? scoreAssessment(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}

export function AssessmentResults() {
  const [result, setResult] = useState<ReturnType<typeof scoreAssessment> | null>(
    readAssessmentResult,
  );

  useEffect(() => {
    let active = true;
    void loadPersistedData<Record<string, number>>(ASSESSMENT_STORAGE_KEY, sessionStorage).then(
      (saved) => {
        if (active && saved) setResult(scoreAssessment(saved));
      },
    );
    return () => {
      active = false;
    };
  }, []);

  if (!result) {
    return (
      <div className="creco-card mx-auto max-w-xl p-8 text-center">
        <p className="text-creco-muted">No assessment answers found.</p>
        <Link href="/compliance/assessment" className="creco-btn creco-btn-primary mt-4">
          Start assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="creco-card p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-creco-muted">Your score</p>
        <p className="mt-2 text-5xl font-bold text-creco-primary">{result.percent}%</p>
        <p className="mt-4 text-lg font-semibold capitalize text-creco-black">{result.band}</p>
        <p className="mt-3 text-sm leading-relaxed text-creco-muted">{result.summary}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Object.entries(result.byDomain).map(([domain, score]) => (
          <div key={domain} className="creco-card p-5">
            <p className="text-sm font-bold text-creco-primary">{domain}</p>
            <p className="mt-1 text-2xl font-bold">{score} pts</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/compliance/checklist" className="creco-btn creco-btn-secondary">
          Open checklist
        </Link>
        <Link href="/guidance?ask=1" className="creco-btn creco-btn-primary">
          Ask guidance question
        </Link>
      </div>
    </div>
  );
}
