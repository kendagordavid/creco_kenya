"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n/client";

type Status = "idle" | "sending" | "done" | "error";

/** Confirm step so link scanners in mail apps cannot unsubscribe someone by opening the link. */
export function NewsUnsubscribe({ token }: { token: string }) {
  const copy = useTranslations().newsUnsubscribe;
  const [status, setStatus] = useState<Status>("idle");

  async function confirm() {
    setStatus("sending");
    try {
      const response = await fetch(`/api/news/unsubscribe?token=${encodeURIComponent(token)}`, { method: "POST" });
      setStatus(response.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="font-semibold text-creco-primary">
        {copy.done}
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={confirm}
        disabled={status === "sending"}
        className="creco-btn creco-btn-primary disabled:opacity-60"
      >
        {copy.confirm}
      </button>
      {status === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-400">
          {copy.error}
        </p>
      )}
    </div>
  );
}
