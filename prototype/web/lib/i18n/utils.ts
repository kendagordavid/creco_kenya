export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

export function pluralSuffix(count: number, locale: "en" | "sw"): string {
  if (locale === "sw") {
    return count === 1 ? "" : " za mada";
  }
  return count === 1 ? "" : "s";
}
