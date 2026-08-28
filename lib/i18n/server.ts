import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { LOCALE_HEADER, readLocaleHeader } from "./locale-header";
import { en, type Dictionary } from "./messages/en";
import { sw } from "./messages/sw";

const dictionaries: Record<Locale, Dictionary> = { en, sw };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export async function getLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromMiddleware = readLocaleHeader(headerStore.get(LOCALE_HEADER));
  if (fromMiddleware) {
    return fromMiddleware;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value && isLocale(value)) {
    return value;
  }
  return defaultLocale;
}

export async function getServerTranslations() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}

export { interpolate, pluralSuffix } from "./utils";
