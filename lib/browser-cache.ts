type CacheRecord = {
  data: unknown;
  /** Until then the entry is fresh and callers may skip the network. */
  expiresAt: number;
  storedAt: number;
  /** Until then a stale entry is kept, so pages can paint it while they refetch. */
  staleUntil?: number;
};

const memoryCache = new Map<string, CacheRecord>();
const STORAGE_PREFIX = "creco:http:";

type BrowserStore = "session" | "local";

function getStorage(store: BrowserStore): Storage | null {
  if (typeof window === "undefined") return null;
  return store === "session" ? sessionStorage : localStorage;
}

function readStorageRecord(key: string, store: BrowserStore): CacheRecord | null {
  const storage = getStorage(store);
  if (!storage) return null;

  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as CacheRecord;
  } catch {
    return null;
  }
}

function writeStorageRecord(key: string, record: CacheRecord, store: BrowserStore) {
  const storage = getStorage(store);
  if (!storage) return;

  try {
    storage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(record));
  } catch {
    // Storage quota exceeded — memory cache still helps this session.
  }
}

function removeStorageRecord(key: string, store: BrowserStore) {
  try {
    getStorage(store)?.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Storage unavailable — nothing to remove.
  }
}

function removeStorageRecords(prefix?: string) {
  for (const store of ["session", "local"] as const) {
    const storage = getStorage(store);
    if (!storage) continue;

    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i += 1) {
      const storageKey = storage.key(i);
      if (!storageKey?.startsWith(STORAGE_PREFIX)) continue;
      const cacheKey = storageKey.slice(STORAGE_PREFIX.length);
      if (!prefix || cacheKey.includes(prefix)) keysToRemove.push(storageKey);
    }
    for (const storageKey of keysToRemove) storage.removeItem(storageKey);
  }
}

export function readBrowserCacheEntry(key: string, store: BrowserStore = "session") {
  const freshMemory = memoryCache.get(key);
  if (freshMemory && freshMemory.expiresAt > Date.now()) {
    return { data: freshMemory.data, fresh: true };
  }

  const stored = readStorageRecord(key, store);
  if (!stored) return null;

  const now = Date.now();
  // Entries written before staleUntil existed stored their keep-until time in expiresAt,
  // so treat them as stale rather than trusting it as a freshness deadline.
  const legacy = stored.staleUntil === undefined;
  const staleUntil = stored.staleUntil ?? stored.storedAt + CACHE_TTL.staleMax;
  if (staleUntil <= now) {
    memoryCache.delete(key);
    removeStorageRecord(key, store);
    return null;
  }

  memoryCache.set(key, stored);
  return {
    data: stored.data,
    fresh: !legacy && stored.expiresAt > now,
  };
}

export function peekBrowserCache<T>(key: string, store: BrowserStore = "session"): T | null {
  const entry = readBrowserCacheEntry(key, store);
  return entry ? (entry.data as T) : null;
}

/**
 * Caches `data` as fresh for `ttlMs`, then keeps it as a stale copy until `keepMs`
 * (default: CACHE_TTL.staleMax) so the next visit can paint it while refetching.
 */
export function writeBrowserCache(
  key: string,
  data: unknown,
  ttlMs: number,
  store: BrowserStore = "session",
  keepMs: number = CACHE_TTL.staleMax,
) {
  const now = Date.now();
  const record: CacheRecord = {
    data,
    expiresAt: now + ttlMs,
    storedAt: now,
    staleUntil: now + Math.max(ttlMs, keepMs),
  };
  memoryCache.set(key, record);
  writeStorageRecord(key, record, store);
}

export function invalidateBrowserCache(prefix?: string) {
  if (!prefix) {
    memoryCache.clear();
    removeStorageRecords();
    return;
  }

  for (const key of memoryCache.keys()) {
    if (key.includes(prefix)) memoryCache.delete(key);
  }
  removeStorageRecords(prefix);
}

export const CACHE_TTL = {
  profile: 10 * 60 * 1000,
  submissions: 5 * 60 * 1000,
  admin: 5 * 60 * 1000,
  public: 60 * 60 * 1000,
  staleMax: 24 * 60 * 60 * 1000,
} as const;
