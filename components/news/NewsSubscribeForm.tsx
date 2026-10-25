"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n/client";

type Status = "idle" | "sending" | "done" | "invalid" | "rate_limited" | "error";

export function NewsSubscribeForm() {
  const { locale, t } = useLocale();
  const copy = t.newsSubscribe;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!consent) return;
    setStatus("sending");
    try {
      const response = await fetch("/api/news/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, locale }),
      });
      if (response.ok) setStatus("done");
      else if (response.status === 400) setStatus("invalid");
      else if (response.status === 429) setStatus("rate_limited");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="creco-card p-6" aria-labelledby="news-subscribe-title">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-creco-green-muted text-creco-primary">
          <Mail className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 id="news-subscribe-title" className="text-lg font-bold text-creco-primary">
            {copy.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-creco-muted">{copy.lead}</p>
        </div>
      </div>

      {status === "done" ? (
        <p role="status" className="mt-4 text-sm font-semibold text-creco-primary">
          {copy.success}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="news-subscribe-email" className="sr-only">
              {copy.emailLabel}
            </label>
            <Input
              id="news-subscribe-email"
              type="email"
              required
              autoComplete="email"
              placeholder={copy.placeholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 flex-1"
            />
            <button
              type="submit"
              disabled={!consent || status === "sending"}
              className="creco-btn creco-btn-primary min-h-11 disabled:opacity-60"
            >
              {status === "sending" ? copy.submitting : copy.submit}
            </button>
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-creco-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[var(--creco-primary)]"
            />
            <span>{copy.consent}</span>
          </label>
          {status !== "idle" && status !== "sending" && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-400">
              {status === "invalid" ? copy.invalid : status === "rate_limited" ? copy.rateLimited : copy.error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
