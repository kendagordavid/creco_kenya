export const NEWS_CATEGORIES = [
  "legislative",
  "regulation",
  "court",
  "guidance",
  "other",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export function isNewsCategory(value: string): value is NewsCategory {
  return (NEWS_CATEGORIES as readonly string[]).includes(value);
}

export const MAX_NEWS_IMAGE_BYTES = 2 * 1024 * 1024;

export const NEWS_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
