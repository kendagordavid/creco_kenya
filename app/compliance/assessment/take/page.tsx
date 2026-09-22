import { AssessmentPanel } from "@/components/AssessmentPanel";

export const metadata = {
  title: "Self-assessment",
};

export default function AssessmentTakePage() {
  return (
    <>
      <section className="creco-section">
        <div className="creco-container">
          <AssessmentPanel />
        </div>
      </section>
    </>
  );
}
