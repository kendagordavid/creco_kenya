import Link from "next/link";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Self-assessment",
};

export default function AssessmentIntroPage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="PBO self-assessment"
        lead="Eight questions across registration, governance, reporting, and operations. Takes about 5 minutes."
        variant="light"
      />
      <PlatformSubnav />
      <ComplianceBanner />
      <section className="creco-section">
        <div className="creco-container max-w-xl text-center">
          <div className="creco-card p-8">
            <ul className="space-y-3 text-left text-sm text-creco-muted">
              <li className="creco-check-item">
                <span className="creco-check-icon">✓</span>
                Not a legal audit — a learning tool for staff and boards
              </li>
              <li className="creco-check-item">
                <span className="creco-check-icon">✓</span>
                Results suggest next steps and link to guidance
              </li>
              <li className="creco-check-item">
                <span className="creco-check-icon">✓</span>
                Answers stay in this browser session until you complete
              </li>
            </ul>
            <Link href="/compliance/assessment/take" className="creco-btn creco-btn-primary mt-8">
              Start assessment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
