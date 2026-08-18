"use client";

import { useEffect, useState } from "react";
import { useFormat, useTranslations } from "@/lib/i18n/client";

type Health = {
  answer_mode?: string;
  ai_ready?: boolean;
  setup_hint?: string | null;
};

export function AiSetupNotice() {
  const t = useTranslations();
  const format = useFormat();
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
      className="mb-6 overflow-hidden rounded-xl border border-creco-accent/25 bg-creco-orange-muted text-sm text-creco-black-soft shadow-sm"
      role="status"
    >
      <div className="h-1 bg-gradient-to-r from-creco-orange to-creco-orange-light" aria-hidden />
      <div className="px-5 py-4">
        <p className="font-bold text-creco-black">{t.aiSetup.title}</p>
        <p className="mt-1 text-creco-muted">
          {format(t.aiSetup.lead, { key: "OPENAI_API_KEY" })}
        </p>
        {health.setup_hint && <p className="mt-2 text-creco-muted">{health.setup_hint}</p>}
      </div>
    </div>
  );
}
