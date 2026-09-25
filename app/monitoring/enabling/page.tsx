import { MonitoringReportForm } from "@/components/MonitoringForms";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Enabling practices report",
};

export default function MonitoringEnablingPage() {
  return (
    <>
      <PageHero
        eyebrow="Civic space monitoring"
        title="Enabling practices report"
        lead="Positive outcomes and good practices worth amplifying."
        backgroundImage="/images/pages/about-community.jpg"
        backgroundAlt="Women gathered at a community meeting in Kilimambogo, Kenya"
      />
      <section className="creco-section">
        <div className="creco-container">
          <MonitoringReportForm
            type="enabling"
            title="Enabling practices report"
            continueHref="/monitoring/upload"
          />
        </div>
      </section>
    </>
  );
}
