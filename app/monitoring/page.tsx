import Link from "next/link";
import { MonitoringReportForm } from "@/components/MonitoringForms";
import { PageHero } from "@/components/PageHero";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.monitoringHub.metaTitle };
}

export default async function MonitoringHubPage() {
  const { t } = await getServerTranslations();

  return (
    <>
      <PageHero
        eyebrow={t.monitoringHub.eyebrow}
        title={t.monitoringHub.title}
        lead={t.monitoringHub.lead}
        backgroundImage="/images/hero/civic-space.jpg"
        backgroundAlt="Black Kenyans gathered in a civic space demonstration"
      />
      <section className="creco-section">
        <div className="creco-container">
          <MonitoringReportForm
            title={t.nav.menu.reportExperience}
            continueHref="/monitoring/upload"
          />
          <p className="mt-8 text-center text-sm text-creco-muted">
            <Link href="/monitoring/submissions" className="font-semibold text-creco-primary no-underline">
              {t.monitoringHub.mySubmissions.title}
            </Link>
            {" — "}
            {t.monitoringHub.mySubmissions.description}
          </p>
          <p className="mt-3 text-center text-sm text-creco-muted">
            <Link href="/report" className="font-semibold text-creco-primary no-underline">
              {t.nav.menu.anonymousReport}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
