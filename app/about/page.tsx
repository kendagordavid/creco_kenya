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
      <section id="history" className="creco-section creco-section-alt scroll-mt-24">
        <div className="creco-container max-w-2xl">
          <h2 className="text-2xl font-bold text-creco-black dark:text-foreground">
            {t.home.history.title}
          </h2>
          {t.home.history.stages.map((stage) => (
            <div key={stage.heading} className="mt-6">
              <h3 className="text-lg font-bold text-creco-black dark:text-foreground">{stage.heading}</h3>
              <p className="mt-2 leading-relaxed text-creco-muted dark:text-muted-foreground">{stage.body}</p>
            </div>
          ))}
          <h3 className="mt-8 text-lg font-bold text-creco-black dark:text-foreground">
            {t.home.history.notesTitle}
          </h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed text-creco-muted dark:text-muted-foreground">
            {t.home.history.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
      <section
        id="partnership"
        className="creco-section scroll-mt-24"
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
