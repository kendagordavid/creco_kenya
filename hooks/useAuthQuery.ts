"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { authFetchJson, peekCachedJson } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";

type UseAuthQueryOptions = {
  ttlMs?: number;
  enabled?: boolean;
};

const noopSubscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards. Cached responses live in
 * sessionStorage, which the server cannot see, so reading them while hydrating would
 * render different HTML from the server. Components mounted after hydration (client
 * navigation) get `true` straight away and can show cached data on their first render.
 */
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useAuthQuery<T extends { error?: string }>(
  url: string,
  options: UseAuthQueryOptions = {},
) {
  const { ttlMs = CACHE_TTL.profile, enabled = true } = options;
  const hydrated = useHydrated();
  const [fetched, setFetched] = useState<{ url: string; data: T } | null>(null);
  const [settledUrl, setSettledUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  let data = fetched?.url === url ? fetched.data : null;
  if (data === null && hydrated) {
    // Adopt the cached copy once hydrated, and keep it even if the cache is cleared later.
    const cached = peekCachedJson<T>(url);
    if (cached) {
      setFetched({ url, data: cached });
      data = cached;
    }
  }

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    authFetchJson<T>(url, undefined, ttlMs)
      .then((result) => {
        if (!active) return;
        if (result.error) {
          setError(result.error);
          return;
        }
        setFetched({ url, data: result });
        setError(null);
      })
      .finally(() => {
        if (active) setSettledUrl(url);
      });

    return () => {
      active = false;
    };
  }, [enabled, ttlMs, url]);

  // Only report loading when there is nothing to show yet; cached data refreshes quietly.
  const loading = enabled && data === null && settledUrl !== url;

  function setData(next: T | null) {
    setFetched(next === null ? null : { url, data: next });
  }

  return { data, loading, error, setData };
}
