import { MonitoringReportForm } from "@/components/MonitoringForms";

export const metadata = {
  title: "Incident report",
};

export default function MonitoringIncidentPage() {
  return (
    <>
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
