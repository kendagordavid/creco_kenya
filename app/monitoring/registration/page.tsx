import { MonitoringReportForm } from "@/components/MonitoringForms";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Registration report",
};

export default function MonitoringRegistrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Civic space monitoring"
        title="Registration experience report"
        lead="Delays, barriers, and process issues with PBO registration."
        backgroundImage="/images/hero/register-correctly.jpg"
        backgroundAlt="Black professional reviewing organisation registration requirements"
      />
      <section className="creco-section">
        <div className="creco-container">
          <MonitoringReportForm
            type="registration"
            title="Registration experience report"
            continueHref="/monitoring/upload"
          />
        </div>
      </section>
    </>
  );
}
