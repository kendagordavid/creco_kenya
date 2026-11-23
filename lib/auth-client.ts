"use client";

import {
  CACHE_TTL,
  invalidateBrowserCache,
  peekBrowserCache,
  readBrowserCacheEntry,
  writeBrowserCache,
} from "@/lib/browser-cache";

type CacheEntry = {
  expiresAt: number;
  data: unknown;
};

const responseCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<unknown>>();

function cacheKey(url: string, init?: RequestInit): string {
  const method = init?.method ?? "GET";
  return `${method}:${url}`;
}

export function invalidateAuthCache(prefix?: string) {
  if (!prefix) {
    responseCache.clear();
    invalidateBrowserCache();
    return;
  }
  for (const key of responseCache.keys()) {
    if (key.includes(prefix)) responseCache.delete(key);
  }
  invalidateBrowserCache(prefix);
}

export function peekCachedJson<T>(url: string, init?: RequestInit): T | null {
  const key = cacheKey(url, init);
  return peekBrowserCache<T>(key, "session");
}

export async function authFetch(input: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, {
    ...init,
    credentials: "same-origin",
    headers,
  });
}

async function fetchAndStore<T>(
  url: string,
  init: RequestInit | undefined,
  key: string,
  ttlMs: number,
): Promise<T> {
  const response = await authFetch(url, init);
  const data = (await response.json()) as T;

  if (response.ok) {
    responseCache.set(key, { data, expiresAt: Date.now() + ttlMs });
    writeBrowserCache(key, data, ttlMs, "session");
  }

  return data;
}

export async function authFetchJson<T>(
  url: string,
  init?: RequestInit,
  ttlMs = CACHE_TTL.profile,
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const key = cacheKey(url, init);

  if (method !== "GET") {
    const response = await authFetch(url, init);
    return (await response.json()) as T;
  }

  const memoryHit = responseCache.get(key);
  if (memoryHit && memoryHit.expiresAt > Date.now()) {
    return memoryHit.data as T;
  }

  const browserHit = readBrowserCacheEntry(key, "session");
  if (browserHit?.fresh) {
    return browserHit.data as T;
  }

  if (inFlight.has(key)) {
    return inFlight.get(key) as Promise<T>;
  }

  // A stale copy is not returned here: pages already paint it from peekCachedJson, and
  // waiting for the network means they then receive the fresh data. It is only the
  // fallback when the network fails.
  const request = fetchAndStore<T>(url, init, key, ttlMs)
    .catch((error: unknown) => {
      if (browserHit) return browserHit.data as T;
      throw error;
    })
    .finally(() => {
      inFlight.delete(key);
    });
  inFlight.set(key, request);
  return request;
}

export async function prefetchAuthJson(url: string, ttlMs = CACHE_TTL.profile) {
  void authFetchJson(url, undefined, ttlMs);
}
