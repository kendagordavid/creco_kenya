import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";

export const LOCALE_HEADER = "x-creco-locale";

export function resolveLocaleFromCookie(cookieValue: string | undefined): Locale {
  if (cookieValue && isLocale(cookieValue)) {
    return cookieValue;
  }
  return defaultLocale;
}

export function readLocaleHeader(headerValue: string | null): Locale | null {
  if (headerValue && isLocale(headerValue)) {
    return headerValue;
  }
  return null;
}

export { LOCALE_COOKIE };
