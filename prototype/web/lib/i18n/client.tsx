"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Locale } from "./config";
import { type Dictionary } from "./messages/en";
import { interpolate } from "./utils";

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  format: (template: string, vars: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type Props = {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
};

export function LocaleProvider({ locale, dictionary, children }: Props) {
  return (
    <LocaleContext.Provider
      value={{
        locale,
        t: dictionary,
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
