"use client";

import { useEffect, useState } from "react";

type Health = {
  answer_mode?: string;
  ai_ready?: boolean;
  setup_hint?: string | null;
};

export function AiSetupNotice() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  if (!health || health.ai_ready || health.answer_mode === "openai") {
    return null;
  }

  return (
    <div
      className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="status"
    >
      <p className="font-semibold">AI answers are off on this deployment</p>
      <p className="mt-1 text-amber-900/90">
        You are seeing compiled topic text only (<code className="text-xs">wiki_direct</code>). Keys
        in <code className="text-xs">.env</code> on your laptop are not sent to Vercel.
      </p>
      {health.setup_hint && (
        <p className="mt-2 text-amber-900/90">{health.setup_hint}</p>
      )}
      <p className="mt-2 text-xs text-amber-800">
        After adding the variable, open{" "}
        <a href="/api/health" className="font-medium underline">
          /api/health
        </a>{" "}
        — it should show <code className="text-xs">answer_mode: openai</code>.
      </p>
    </div>
  );
}
