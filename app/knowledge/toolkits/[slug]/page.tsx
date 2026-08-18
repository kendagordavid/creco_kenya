import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { getToolkitBySlug } from "@/lib/content/knowledge";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ToolkitDetailPage({ params }: Props) {
  const { slug } = await params;
  const toolkit = getToolkitBySlug(slug);
  if (!toolkit) notFound();

  return (
    <>
      <PageHero eyebrow="Toolkit" title={toolkit.title} lead={toolkit.summary} variant="light" />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <ol className="space-y-4">
            {toolkit.sections.map((section, index) => (
              <li key={section} className="creco-check-item">
                <span className="creco-check-icon">{index + 1}</span>
                <span className="text-sm font-medium">{section}</span>
              </li>
            ))}
          </ol>
          <Link href="/knowledge" className="creco-btn creco-btn-secondary mt-10">
            Back to knowledge hub
          </Link>
        </div>
      </section>
    </>
  );
}
