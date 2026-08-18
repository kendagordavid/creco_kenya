import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Ask CRECO",
};

export default function AskCrecoPage() {
  return (
    <>
      <PageHero
        eyebrow="Guidance"
        title="Ask CRECO"
        lead="Request human follow-up when automated guidance does not fully address your situation."
        variant="light"
      />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container max-w-xl">
          <div className="creco-card p-8">
            <p className="text-sm leading-relaxed text-creco-muted">
              Email{" "}
              <a href="mailto:info@crecokenya.org" className="font-semibold text-creco-primary">
                info@crecokenya.org
              </a>{" "}
              with your organisation name, county, and a brief description. CRECO staff respond when
              capacity allows — typically within a few working days.
            </p>
            <p className="mt-4 text-sm text-creco-muted">
              For faster self-service, try the{" "}
              <Link href="/guidance?ask=1" className="font-semibold text-creco-primary no-underline">
                guidance tool
              </Link>{" "}
              or{" "}
              <Link href="/guidance/flag" className="font-semibold text-creco-primary no-underline">
                flag an answer
              </Link>{" "}
              that needs correction.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
