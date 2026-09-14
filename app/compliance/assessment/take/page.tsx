import { AssessmentPanel } from "@/components/AssessmentPanel";
import { ComplianceBanner } from "@/components/ComplianceBanner";

export const metadata = {
  title: "Self-assessment",
};

export default function AssessmentTakePage() {
  return (
    <>
      <ComplianceBanner />
      <section className="creco-section">
        <div className="creco-container">
          <AssessmentPanel />
        </div>
      </section>
    </>
  );
}
