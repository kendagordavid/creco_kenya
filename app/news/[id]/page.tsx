import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsArticleBody } from "@/components/news/NewsArticleBody";
import { NewsCategoryBadge } from "@/components/news/NewsCategoryBadge";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";
import { localizeNewsPost } from "@/lib/news-locale";
import { formatNewsDate } from "@/lib/news-format";
import { findNewsPostById } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const post = await findNewsPostById(id, { publishedOnly: true });
  if (!post) {
    return { title: t.newsPage.metaTitle };
  }
  const localized = localizeNewsPost(post, locale);
  return {
    title: localized.title,
    description: localized.summary,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { id } = await params;
  const { locale, t } = await getServerTranslations();
  const post = await findNewsPostById(id, { publishedOnly: true });
  if (!post) {
    notFound();
  }

  const localized = localizeNewsPost(post, locale);

  return (
    <article className="creco-section">
      <div className="creco-container max-w-3xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-creco-primary no-underline hover:text-creco-accent"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {t.newsPage.backToNews}
        </Link>

        <header className="mt-8 border-b-2 border-creco-primary/15 pb-8">
          <NewsCategoryBadge category={post.category} labels={t.newsPage.categories} />
          <time dateTime={post.publishedAt} className="mt-3 block text-sm text-creco-muted">
            {formatNewsDate(post.publishedAt, locale)}
          </time>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-creco-primary sm:text-4xl">
            {localized.title}
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-creco-accent">
            {t.newsPage.byline}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-creco-muted">{localized.summary}</p>
        </header>

        {post.hasImage && (
          <figure className="creco-news-figure my-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/news/${post.id}/image`}
              alt=""
              className="w-full rounded-lg object-cover"
            />
          </figure>
        )}

        <NewsArticleBody body={localized.body} className="space-y-5 text-base sm:text-lg" />

        <p className="mt-12 border-t border-creco-primary/10 pt-6 text-sm text-creco-muted">
          {t.footer.legalReviewed}
        </p>
      </div>
    </article>
  );
}
