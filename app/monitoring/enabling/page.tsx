import { MonitoringReportForm } from "@/components/MonitoringForms";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Enabling practices report",
};

export default function MonitoringEnablingPage() {
  return (
    <>
      <PlatformSubnav />
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
