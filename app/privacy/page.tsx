import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.privacy.metaTitle };
}

export default async function PrivacyPage() {
  const { t } = await getServerTranslations();

  const sections = [
    { title: t.privacy.accountsTitle, body: t.privacy.accountsBody },
    { title: t.privacy.monitoringTitle, body: t.privacy.monitoringBody },
    { title: t.privacy.useTitle, body: t.privacy.useBody },
    { title: t.privacy.contactTitle, body: t.privacy.contactBody },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.privacy.eyebrow}
        title={t.privacy.title}
        lead={t.privacy.lead}
        backgroundImage="/images/pages/privacy-notes.jpg"
        backgroundAlt={t.privacy.imageAlt}
      />
      <section className="creco-section">
        <div className="creco-container max-w-2xl space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-creco-black dark:text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 leading-relaxed text-creco-muted dark:text-muted-foreground">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
