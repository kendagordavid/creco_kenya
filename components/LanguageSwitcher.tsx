"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions/locale";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/lib/i18n/config";
import { useCurrentLocale, useFormat, useTranslations } from "@/lib/i18n/client";

export function LanguageSwitcher() {
  const locale = useCurrentLocale();
  const t = useTranslations();
  const format = useFormat();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;

    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-creco-border bg-creco-surface p-0.5 dark:border-border dark:bg-card"
      role="group"
      aria-label={t.language.label}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            disabled={pending && active}
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
