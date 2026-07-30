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

  const [before, after] = format(t.aiSetup.lead, { key: "OPENAI_API_KEY" }).split(
    "OPENAI_API_KEY",
  );

  return (
    <div
      className="mb-6 rounded-xl border border-creco-accent/30 bg-creco-orange-muted px-4 py-3 text-sm text-creco-black-soft"
      role="status"
    >
      <p className="font-bold text-creco-black">{t.aiSetup.title}</p>
      <p className="mt-1 text-creco-muted">
        {before}
        <code className="text-xs">OPENAI_API_KEY</code>
        {after}
      </p>
      {health.setup_hint && <p className="mt-2 text-creco-muted">{health.setup_hint}</p>}
    </div>
  );
}
