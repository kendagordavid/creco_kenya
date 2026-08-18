import Link from "next/link";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { TEMPLATE_ITEMS } from "@/lib/content/templates";

export const metadata = {
  title: "Template library",
};

export default function TemplatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="Template library"
        lead="Starting points for board resolutions, policies, and reporting — review with your counsel before use."
        variant="light"
      />
      <PlatformSubnav />
      <ComplianceBanner />
      <section className="creco-section">
        <div className="creco-container">
          <div className="grid gap-5 sm:grid-cols-2">
            {TEMPLATE_ITEMS.map((template) => (
              <Link
                key={template.slug}
                href={`/compliance/templates/${template.slug}`}
                className="creco-card block p-6 no-underline"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-creco-muted">
                  {template.category} · {template.format}
                </span>
                <h2 className="mt-2 text-lg font-bold text-creco-black">{template.title}</h2>
                <p className="mt-2 text-sm text-creco-muted">{template.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
