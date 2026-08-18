import Link from "next/link";
import { ModuleCard } from "@/components/ModuleCard";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Monitoring",
};

export default function MonitoringHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Civic space monitoring"
        title="Report your experience"
        lead="Submissions are confidential. Moderated by CRECO staff before use in advocacy."
      />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container">
          <div className="grid gap-5 sm:grid-cols-2">
            <ModuleCard
              title="Registration experience"
              description="Delays, barriers, and process issues with PBO registration."
              href="/monitoring/registration"
            />
            <ModuleCard
              title="Enabling practices"
              description="Positive outcomes and good practices worth amplifying."
              href="/monitoring/enabling"
              accent="orange"
            />
            <ModuleCard
              title="Civic space incident"
              description="Report violations with severity classification."
              href="/monitoring/incident"
            />
            <ModuleCard
              title="My submissions"
              description="View status of past reports — sign in required."
              href="/monitoring/submissions"
              accent="orange"
            />
          </div>
          <p className="mt-8 text-center text-sm text-creco-muted">
            New to the platform?{" "}
            <Link href="/register" className="font-semibold text-creco-primary no-underline">
              Register a PBO account
            </Link>{" "}
            before submitting reports.
          </p>
        </div>
      </section>
    </>
  );
}
