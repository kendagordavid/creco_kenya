"use client";

import { useEffect, useState } from "react";
import { peekBrowserCache, writeBrowserCache, CACHE_TTL } from "@/lib/browser-cache";
import { useFormat, useTranslations } from "@/lib/i18n/client";

type Health = {
  answer_mode?: string;
  ai_ready?: boolean;
  setup_hint?: string | null;
};

const HEALTH_CACHE_KEY = "GET:/api/health";

export function AiSetupNotice() {
  const t = useTranslations();
  const format = useFormat();
  const [health, setHealth] = useState<Health | null>(() =>
    peekBrowserCache<Health>(HEALTH_CACHE_KEY, "session"),
  );

  useEffect(() => {
    const cached = peekBrowserCache<Health>(HEALTH_CACHE_KEY, "session");
    if (cached) {
      setHealth(cached);
    }

    fetch("/api/health")
      .then((r) => r.json())
      .then((data: Health) => {
        writeBrowserCache(HEALTH_CACHE_KEY, data, CACHE_TTL.public, "session");
        setHealth(data);
      })
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
