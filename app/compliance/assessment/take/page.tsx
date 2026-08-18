import { AssessmentPanel } from "@/components/AssessmentPanel";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Self-assessment",
};

export default function AssessmentTakePage() {
  return (
    <>
      <PlatformSubnav />
      <ComplianceBanner />
      <section className="creco-section">
        <div className="creco-container">
          <AssessmentPanel />
        </div>
      </section>
    </>
  );
}
