import { ComplianceBanner } from "@/components/ComplianceBanner";
import { ModuleCard } from "@/components/ModuleCard";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Compliance tools",
};

export default function ComplianceHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance support"
        title="Compliance tools"
        lead="Checklists, self-assessment, and templates mapped to PBO Act domains."
      />
      <PlatformSubnav />
      <ComplianceBanner />
      <section className="creco-section">
        <div className="creco-container">
          <div className="grid gap-5 md:grid-cols-3">
            <ModuleCard
              title="Organizational checklist"
              description="Track compliance items online, print or save progress in your browser."
              href="/compliance/checklist"
            />
            <ModuleCard
              title="Self-assessment"
              description="Automated scoring mapped to registration, governance, reporting, and operations."
              href="/compliance/assessment"
              accent="orange"
            />
            <ModuleCard
              title="Template library"
              description="Board resolutions, policies, and reporting formats for PBOs."
              href="/compliance/templates"
            />
          </div>
        </div>
      </section>
    </>
  );
}
