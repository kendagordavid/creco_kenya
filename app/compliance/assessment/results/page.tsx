import { AssessmentResults } from "@/components/AssessmentResults";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Assessment results",
};

export default function AssessmentResultsPage() {
  return (
    <>
      <PageHero eyebrow="Compliance" title="Your assessment results" variant="light" />
      <PlatformSubnav />
      <ComplianceBanner />
      <section className="creco-section">
        <div className="creco-container">
          <AssessmentResults />
        </div>
      </section>
    </>
  );
}
