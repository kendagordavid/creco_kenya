import type { Locale } from "@/lib/i18n/config";

export function formatNewsDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "sw" ? "sw-KE" : "en-KE", {
    dateStyle: "long",
  }).format(new Date(iso));
}

export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}
