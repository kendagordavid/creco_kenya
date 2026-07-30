"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions/locale";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";
import { useCurrentLocale, useFormat, useTranslations } from "@/lib/i18n/client";

export function LanguageSwitcher() {
  const locale = useCurrentLocale();
  const t = useTranslations();
  const format = useFormat();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(nextLocale: Locale) {
    if (nextLocale === locale || pending) return;

    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-creco-border bg-creco-surface p-0.5"
      role="group"
      aria-label={t.language.label}
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
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
              active
                ? "bg-creco-primary text-white shadow-sm"
                : "text-creco-black-soft/70 hover:bg-white hover:text-creco-black disabled:opacity-50"
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
