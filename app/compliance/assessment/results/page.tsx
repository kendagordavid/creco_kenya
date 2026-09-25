import { AssessmentResults } from "@/components/AssessmentResults";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Assessment results",
};

export default function AssessmentResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="Your assessment results"
        backgroundImage="/images/hero/stay-compliant.jpg"
        backgroundAlt="Black professional preparing compliance documentation"
      />
      <section className="creco-section">
        <div className="creco-container">
          <AssessmentResults />
        </div>
      </section>
    </>
  );
}
