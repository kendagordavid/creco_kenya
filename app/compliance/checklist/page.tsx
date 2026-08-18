import Link from "next/link";
import { ChecklistPanel } from "@/components/ChecklistPanel";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Compliance checklist",
};

export default function ChecklistPage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="Organizational compliance checklist"
        lead="Work through governance, registration, reporting, and operational items."
        variant="light"
      />
      <PlatformSubnav />
      <ComplianceBanner />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <p className="mb-6 text-sm text-creco-muted">
            Progress is saved in this browser.{" "}
            <Link href="/login" className="font-semibold text-creco-primary no-underline">
              Sign in
            </Link>{" "}
            to sync across devices when cloud save is enabled.
          </p>
          <ChecklistPanel />
        </div>
      </section>
    </>
  );
}
