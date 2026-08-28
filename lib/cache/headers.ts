/** Shared Cache-Control values for CDN, browsers, and API routes. */

export const PUBLIC_CACHE = {
  wiki: "public, s-maxage=3600, stale-while-revalidate=86400",
  search: "public, s-maxage=300, stale-while-revalidate=600",
  health: "public, s-maxage=120, stale-while-revalidate=300",
  privateShort: "private, max-age=60, stale-while-revalidate=120",
  immutable: "public, max-age=31536000, immutable",
  /** Guest HTML — edge cache with locale cookie variance. */
  publicPage:
    "public, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400",
} as const;

export function withCacheControl(init?: ResponseInit, cacheControl?: string): ResponseInit {
  if (!cacheControl) return init ?? {};
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", cacheControl);
  return { ...init, headers };
}
