type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export async function loadPersistedData<T>(
  key: string,
  storage?: StorageLike,
): Promise<T | null> {
  try {
    const response = await fetch(`/api/user-data?key=${encodeURIComponent(key)}`, {
      credentials: "same-origin",
    });
    if (response.ok) {
      const body = (await response.json()) as { data?: T | null };
      if (body.data != null) {
        storage?.setItem(key, JSON.stringify(body.data));
        return body.data;
      }
    }
  } catch {
    // Fall back to browser storage when offline or not signed in.
  }

  if (!storage) return null;

  try {
    const saved = storage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : null;
  } catch {
    return null;
  }
}

export async function savePersistedData<T>(
  key: string,
  data: T,
  storage?: StorageLike,
): Promise<void> {
  storage?.setItem(key, JSON.stringify(data));

  try {
    await fetch("/api/user-data", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data }),
    });
  } catch {
    // Local cache remains available if the server save fails.
  }
}

export async function clearPersistedData(key: string, storage?: StorageLike): Promise<void> {
  storage?.removeItem(key);

  try {
    await fetch(`/api/user-data?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
  } catch {
    // Ignore network errors during cleanup.
  }
}
