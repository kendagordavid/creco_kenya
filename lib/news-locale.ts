import type { Locale } from "@/lib/i18n/config";
import type { NewsPostRecord } from "@/lib/store";

export type LocalizedNewsPost = {
  title: string;
  summary: string;
  body: string;
};

export function localizeNewsPost(post: NewsPostRecord, locale: Locale): LocalizedNewsPost {
  if (locale === "sw") {
    return {
      title: post.titleSw?.trim() || post.titleEn,
      summary: post.summarySw?.trim() || post.summaryEn,
      body: post.bodySw?.trim() || post.bodyEn,
    };
  }
  return {
    title: post.titleEn,
    summary: post.summaryEn,
    body: post.bodyEn,
  };
}
