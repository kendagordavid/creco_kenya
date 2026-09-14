import { MonitoringUploadForm } from "@/components/MonitoringForms";

export const metadata = {
  title: "Upload & consent",
};

export default function MonitoringUploadPage() {
  return (
    <>
      <section className="creco-section">
        <div className="creco-container">
          <MonitoringUploadForm />
        </div>
      </section>
    </>
  );
}
