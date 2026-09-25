import { ModuleCard } from "@/components/ModuleCard";
import { PageHero } from "@/components/PageHero";

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
        backgroundImage="/images/pages/compliance-documents.jpg"
        backgroundAlt="Hands signing a printed compliance document"
      />
      <section className="creco-section">
        <div className="creco-container">
          <div className="grid gap-5 md:grid-cols-3">
            <ModuleCard
              title="Organizational checklist"
              description="Track compliance items online, print or save progress in your browser."
              href="/compliance/checklist"
              imageSrc="/images/hero/stay-compliant.jpg"
              imageAlt="Black professional preparing compliance documentation"
            />
            <ModuleCard
              title="Self-assessment"
              description="Automated scoring mapped to registration, governance, reporting, and operations."
              href="/compliance/assessment"
              accent="orange"
              imageSrc="/images/hero/understand-the-law.jpg"
              imageAlt="Kenyan community members gathered in Kargi, Kenya"
            />
            <ModuleCard
              title="Template library"
              description="Board resolutions, policies, and reporting formats for PBOs."
              href="/compliance/templates"
              imageSrc="/images/pages/compliance-documents.jpg"
              imageAlt="Hands signing a printed compliance document"
            />
          </div>
        </div>
      </section>
    </>
  );
}
