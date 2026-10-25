"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/lib/i18n/config";
import { useCurrentLocale, useFormat, useTranslations } from "@/lib/i18n/client";

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function LanguageSwitcher() {
  const serverLocale = useCurrentLocale();
  // Highlight the chosen language straight away while the page re-renders.
  const [locale, setOptimisticLocale] = useOptimistic(serverLocale);
  const t = useTranslations();
  const format = useFormat();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;

    // The cookie is all the server needs, so one refresh is the only round trip.
    writeLocaleCookie(nextLocale);
    startTransition(() => {
      setOptimisticLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-creco-border bg-creco-surface p-0.5 dark:border-border dark:bg-card"
      role="group"
      aria-label={t.language.label}
      aria-busy={pending}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            aria-pressed={active}
            aria-label={format(t.language.switchTo, { language: localeNames[code] })}
            onClick={() => handleChange(code)}
            className={`min-h-11 rounded-md px-3.5 py-2 text-xs font-bold transition ${
              active
                ? "bg-creco-primary text-white shadow-sm"
                : "text-creco-black-soft/70 hover:bg-white hover:text-creco-black disabled:opacity-50 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
