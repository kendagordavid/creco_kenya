import "server-only";

import { getDictionary } from "@/lib/i18n/server";
import { localizeNewsPost } from "@/lib/news-locale";
import {
  claimNewsPostForEmail,
  listActiveNewsSubscribers,
  type NewsPostRecord,
  type NewsSubscriber,
} from "@/lib/store";

/** Resend accepts at most 100 messages per batch request. */
const BATCH_SIZE = 100;

export function newsEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.NEWS_EMAIL_FROM?.trim());
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildMessage(post: NewsPostRecord, subscriber: NewsSubscriber, siteUrl: string) {
  const t = getDictionary(subscriber.locale).newsEmail;
  const { title, summary } = localizeNewsPost(post, subscriber.locale);
  const storyUrl = `${siteUrl}/news/${post.id}`;
  const unsubscribeUrl = `${siteUrl}/news/unsubscribe?token=${subscriber.token}`;

  const text = `${title}\n\n${summary}\n\n${t.readMore}: ${storyUrl}\n\n${t.footer}\n${t.unsubscribe}: ${unsubscribeUrl}`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
<p style="color:#1f6b45;font-weight:bold;margin:0 0 8px">Mashirika Law · ${escapeHtml(t.eyebrow)}</p>
<h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(title)}</h1>
<p style="font-size:15px;line-height:1.5">${escapeHtml(summary)}</p>
<p><a href="${storyUrl}" style="display:inline-block;background:#1f6b45;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">${escapeHtml(t.readMore)}</a></p>
<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
<p style="font-size:12px;color:#666">${escapeHtml(t.footer)} <a href="${unsubscribeUrl}" style="color:#666">${escapeHtml(t.unsubscribe)}</a></p>
</div>`;

  return {
    from: process.env.NEWS_EMAIL_FROM!.trim(),
    to: [subscriber.email],
    subject: title,
    text,
    html,
    headers: {
      "List-Unsubscribe": `<${siteUrl}/api/news/unsubscribe?token=${subscriber.token}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

/**
 * Emails a newly published post to every active subscriber, once per post.
 * Does nothing when email is not configured or the post is not published.
 */
export async function emailNewsPostToSubscribers(post: NewsPostRecord, requestOrigin: string): Promise<void> {
  if (!post.published || !newsEmailConfigured()) return;
  if (new Date(post.publishedAt).getTime() > Date.now()) return;
  if (!(await claimNewsPostForEmail(post.id))) return;

  const siteUrl = (process.env.SITE_URL?.trim() || requestOrigin).replace(/\/$/, "");
  const subscribers = await listActiveNewsSubscribers();

  for (let start = 0; start < subscribers.length; start += BATCH_SIZE) {
    const batch = subscribers.slice(start, start + BATCH_SIZE).map((subscriber) => buildMessage(post, subscriber, siteUrl));
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error(`News email batch failed (${response.status}): ${detail.slice(0, 300)}`);
    }
  }
}
