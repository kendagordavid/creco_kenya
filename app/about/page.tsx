import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.about.metaTitle };
}

export default async function AboutPage() {
  const { t } = await getServerTranslations();

  return (
    <>
      <PageHero
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        lead={t.about.lead}
        backgroundImage="/images/pages/about-community.jpg"
        backgroundAlt={t.about.imageAlt}
        backgroundCredit="Photo: McKay Savage / Wikimedia Commons"
      />
      <section className="creco-section">
        <div className="creco-container max-w-2xl">
          <h2 className="text-2xl font-bold text-creco-black dark:text-foreground">
            {t.about.whoWeAreTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-creco-muted dark:text-muted-foreground">
            {t.about.whoWeAreP1}
          </p>
          <p className="mt-4 leading-relaxed text-creco-muted dark:text-muted-foreground">
            {t.about.whoWeAreP2}
          </p>
        </div>
      </section>
      <section
        id="partnership"
        className="creco-section creco-section-alt scroll-mt-24"
      >
        <div className="creco-container max-w-2xl">
          <h2 className="text-2xl font-bold text-creco-black dark:text-foreground">
            {t.about.partnershipTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-creco-muted dark:text-muted-foreground">
            {t.about.partnershipP1}
          </p>
          <p className="mt-4 leading-relaxed text-creco-muted dark:text-muted-foreground">
            {t.about.partnershipP2}
          </p>
        </div>
      </section>
    </>
  );
}
