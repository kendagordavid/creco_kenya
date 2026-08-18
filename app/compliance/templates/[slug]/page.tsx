import Link from "next/link";
import { notFound } from "next/navigation";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { CopyButton } from "@/components/CopyButton";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { getTemplateBySlug } from "@/lib/content/templates";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  return (
    <>
      <PageHero eyebrow="Template" title={template.title} lead={template.summary} variant="light" />
      <PlatformSubnav />
      <ComplianceBanner />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <pre className="overflow-x-auto rounded-lg border border-creco-border bg-creco-surface p-6 text-sm leading-relaxed whitespace-pre-wrap">
            {template.body}
          </pre>
          <div className="mt-6 flex flex-wrap gap-3">
            <CopyButton text={template.body} />
            <Link href="/compliance/templates" className="creco-btn creco-btn-secondary">
              All templates
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
