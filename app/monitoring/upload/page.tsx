import { MonitoringUploadForm } from "@/components/MonitoringForms";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Upload & consent",
};

export default function MonitoringUploadPage() {
  return (
    <>
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container">
          <MonitoringUploadForm />
        </div>
      </section>
    </>
  );
}
