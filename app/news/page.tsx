import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.newsPage.metaTitle };
}

export default async function NewsPage() {
  const { t } = await getServerTranslations();

  return (
    <>
      <PageHero
        eyebrow={t.newsPage.eyebrow}
        title={t.newsPage.title}
        lead={t.newsPage.lead}
        backgroundImage="/images/hero/civic-space.jpg"
        backgroundAlt={t.home.hero.slides[4]?.imageAlt ?? ""}
      />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <h2 className="text-xl font-bold text-creco-primary">{t.newsPage.kindsTitle}</h2>
          <ul className="mt-4 space-y-3">
            {t.newsPage.kinds.map((kind) => (
              <li key={kind} className="border-l-2 border-creco-primary/30 pl-4 text-creco-muted">
                {kind}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-creco-muted">{t.newsPage.empty}</p>
          <p className="mt-6 text-sm text-creco-muted">{t.footer.legalReviewed}</p>
        </div>
      </section>
    </>
  );
}
