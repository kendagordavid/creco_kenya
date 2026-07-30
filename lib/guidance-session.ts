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

export function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
