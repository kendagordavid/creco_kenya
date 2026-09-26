import type { Metadata } from "next";
import { LockKeyhole, Shield } from "lucide-react";
import { AnonymousReportForm } from "@/components/AnonymousReportForm";
import { PageHero } from "@/components/PageHero";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.anonymousReport.metaTitle };
}

export default async function AnonymousReportPage() {
  const { t } = await getServerTranslations();

  return (
    <>
      <PageHero
        eyebrow={t.anonymousReport.eyebrow}
        title={t.anonymousReport.title}
        lead={t.anonymousReport.lead}
        backgroundImage="/images/pages/privacy-notes.jpg"
        backgroundAlt={t.anonymousReport.imageAlt}
      />
      <section className="creco-section">
        <div className="creco-container grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="creco-card p-6">
              <Shield className="size-5 text-creco-primary" aria-hidden />
              <h2 className="mt-3 text-lg font-bold text-creco-black dark:text-foreground">
                {t.anonymousReport.noAccountTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
                {t.anonymousReport.noAccountBody}
              </p>
            </div>
            <div className="creco-card p-6">
              <LockKeyhole className="size-5 text-creco-primary" aria-hidden />
              <h2 className="mt-3 text-lg font-bold text-creco-black dark:text-foreground">
                {t.anonymousReport.privateTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
                {t.anonymousReport.privateBody}
              </p>
            </div>
          </div>
          <div className="creco-card p-8">
            <h2 className="text-xl font-bold text-creco-black dark:text-foreground">
              {t.anonymousReport.formTitle}
            </h2>
            <p className="mt-3 mb-6 text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
              {t.anonymousReport.formLead}
            </p>
            <AnonymousReportForm />
          </div>
        </div>
      </section>
    </>
  );
}
