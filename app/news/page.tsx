import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { NewsCategoryBadge } from "@/components/news/NewsCategoryBadge";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";
import { localizeNewsPost } from "@/lib/news-locale";
import { formatNewsDate } from "@/lib/news-format";
import { listNewsPosts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.newsPage.metaTitle };
}

export default async function NewsPage() {
  const { locale, t } = await getServerTranslations();
  const posts = await listNewsPosts({ publishedOnly: true });
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow={t.newsPage.eyebrow}
        title={t.newsPage.title}
        lead={t.newsPage.lead}
        backgroundImage="/images/hero/civic-space.jpg"
        backgroundAlt={t.home.hero.slides[4]?.imageAlt ?? ""}
      />

      <section className="creco-section creco-section--after-hero">
        <div className="creco-container max-w-5xl">
          {posts.length === 0 ? (
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-creco-primary">{t.newsPage.kindsTitle}</h2>
              <ul className="mt-4 space-y-3">
                {t.newsPage.kinds.map((kind) => (
                  <li key={kind} className="border-l-2 border-creco-primary/30 pl-4 text-creco-muted">
                    {kind}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm leading-relaxed text-creco-muted">{t.newsPage.empty}</p>
            </div>
          ) : (
            <>
              <p className="creco-news-dateline">{t.newsPage.dateline}</p>

              {lead && (
                <article className="creco-news-lead mt-8">
                  <div className="creco-news-lead-grid">
                    {lead.hasImage && (
                      <Link href={`/news/${lead.id}`} className="creco-news-lead-media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/news/${lead.id}/image`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </Link>
                    )}
                    <div className="creco-news-lead-copy">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-creco-accent">
                        {t.newsPage.featuredLabel}
                      </p>
                      <NewsCategoryBadge
                        category={lead.category}
                        labels={t.newsPage.categories}
                        className="mt-3"
                      />
                      <time
                        dateTime={lead.publishedAt}
                        className="mt-2 block text-sm text-creco-muted"
                      >
                        {formatNewsDate(lead.publishedAt, locale)}
                      </time>
                      <h2 className="mt-3 text-2xl font-bold leading-tight text-creco-primary sm:text-4xl">
                        <Link
                          href={`/news/${lead.id}`}
                          className="no-underline hover:text-creco-accent"
                        >
                          {localizeNewsPost(lead, locale).title}
                        </Link>
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-creco-muted sm:text-lg">
                        {localizeNewsPost(lead, locale).summary}
                      </p>
                      <Link
                        href={`/news/${lead.id}`}
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-creco-primary no-underline hover:text-creco-accent"
                      >
                        {t.newsPage.readStory}
                        <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {rest.length > 0 && (
                <div className="mt-14">
                  <h2 className="text-lg font-bold uppercase tracking-wide text-creco-primary">
                    {t.newsPage.moreHeadlines}
                  </h2>
                  <ul className="creco-news-list mt-6 divide-y divide-creco-primary/10">
                    {rest.map((post) => {
                      const localized = localizeNewsPost(post, locale);
                      return (
                        <li key={post.id} className="creco-news-list-item">
                          <Link href={`/news/${post.id}`} className="creco-news-list-link">
                            <div className="min-w-0 flex-1">
                              <NewsCategoryBadge
                                category={post.category}
                                labels={t.newsPage.categories}
                              />
                              <time
                                dateTime={post.publishedAt}
                                className="mt-2 block text-xs text-creco-muted"
                              >
                                {formatNewsDate(post.publishedAt, locale)}
                              </time>
                              <h3 className="mt-1 text-lg font-bold text-creco-primary group-hover:text-creco-accent">
                                {localized.title}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-sm text-creco-muted">
                                {localized.summary}
                              </p>
                            </div>
                            {post.hasImage && (
                              <div className="creco-news-list-thumb shrink-0 overflow-hidden rounded-md">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`/api/news/${post.id}/image`}
                                  alt=""
                                  className="size-full object-cover"
                                />
                              </div>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          )}
          <p className="mt-10 text-sm text-creco-muted">{t.footer.legalReviewed}</p>
        </div>
      </section>
    </>
  );
}
