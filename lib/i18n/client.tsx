"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Locale } from "./config";
import { en, type Dictionary } from "./messages/en";
import { sw } from "./messages/sw";
import { interpolate } from "./utils";

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  format: (template: string, vars: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type Props = {
  locale: Locale;
  children: ReactNode;
};

/**
 * Both dictionaries ship in the client bundle, which the browser caches once.
 * The server only passes the locale, so pages and language switches do not
 * re-send ~55 KB of translations in every response.
 */
const dictionaries: Record<Locale, Dictionary> = { en, sw };

export function LocaleProvider({ locale, children }: Props) {
  return (
    <LocaleContext.Provider
      value={{
        locale,
        t: dictionaries[locale],
        format: interpolate,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useTranslations() {
  return useLocale().t;
}

export function useFormat() {
  return useLocale().format;
}

export function useCurrentLocale() {
  return useLocale().locale;
}
