import { MonitoringReportForm } from "@/components/MonitoringForms";
import { PageHero } from "@/components/PageHero";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.monitoringHub.enablingPage.metaTitle };
}

export default async function MonitoringEnablingPage() {
  const { t } = await getServerTranslations();

  return (
    <>
      <PageHero
        eyebrow={t.monitoringHub.eyebrow}
        title={t.monitoringHub.enablingPage.title}
        lead={t.monitoringHub.enablingPage.lead}
      />
      <section className="creco-section">
        <div className="creco-container">
          <MonitoringReportForm
            title={t.monitoringHub.enablingPage.formTitle}
            continueHref="/monitoring/upload"
            initialType="enabling"
          />
        </div>
      </section>
    </>
  );
}
