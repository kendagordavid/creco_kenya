import { MonitoringReportForm } from "@/components/MonitoringForms";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Incident report",
};

export default function MonitoringIncidentPage() {
  return (
    <>
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container">
          <MonitoringReportForm
            type="incident"
            title="Civic space incident report"
            continueHref="/monitoring/upload"
          />
        </div>
      </section>
    </>
  );
}
