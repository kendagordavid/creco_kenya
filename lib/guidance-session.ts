import { Turn } from "@/components/ChatTurn";

const STORAGE_KEY = "creco-guidance-conversation";
const MAX_TURNS = 50;

export function loadConversation(): Turn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Turn[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (turn) =>
        typeof turn.id === "string" &&
        typeof turn.question === "string" &&
        typeof turn.answer === "string" &&
        typeof turn.createdAt === "number",
    );
  } catch {
    return [];
  }
}

export function saveConversation(turns: Turn[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turns.slice(-MAX_TURNS)));
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

export function clearConversation(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function createTurnId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `turn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatRelativeTime(
  timestamp: number,
  options?: { locale?: string; justNow?: string },
): string {
  const { locale, justNow = "Just now" } = options ?? {};
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return justNow;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
