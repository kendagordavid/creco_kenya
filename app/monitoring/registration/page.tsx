import { MonitoringReportForm } from "@/components/MonitoringForms";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Registration report",
};

export default function MonitoringRegistrationPage() {
  return (
    <>
      <PlatformSubnav />
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
