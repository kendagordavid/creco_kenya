"use client";

import { useEffect, useState } from "react";
import { authFetchJson, peekCachedJson } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";

type UseAuthQueryOptions = {
  ttlMs?: number;
  enabled?: boolean;
};

export function useAuthQuery<T extends { error?: string }>(
  url: string,
  options: UseAuthQueryOptions = {},
) {
  const { ttlMs = CACHE_TTL.profile, enabled = true } = options;
  const [data, setData] = useState<T | null>(() => peekCachedJson<T>(url));
  const [loading, setLoading] = useState(() => enabled && peekCachedJson<T>(url) === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let active = true;
    const hadCache = peekCachedJson<T>(url) !== null;
    if (!hadCache) setLoading(true);

    authFetchJson<T>(url, undefined, ttlMs)
      .then((result) => {
        if (!active) return;
        if (result.error) {
          setError(result.error);
          return;
        }
        setData(result);
        setError(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled, ttlMs, url]);

  return { data, loading, error, setData };
}
