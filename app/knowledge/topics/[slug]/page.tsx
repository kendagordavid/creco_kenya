import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { WikiBody } from "@/components/WikiBody";
import { loadWikiPages } from "@/lib/wiki-server";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = loadWikiPages().find((p) => p.slug === slug);
  return { title: page?.title ?? "Topic" };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = loadWikiPages().find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <>
      <PageHero eyebrow="Knowledge hub" title={page.title} variant="light" />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <WikiBody body={page.body} />
          {page.sourceDocuments.length > 0 && (
            <div className="creco-card mt-10 p-6">
              <h2 className="text-lg font-bold text-creco-primary">Source documents</h2>
              <ul className="mt-4 space-y-2">
                {page.sourceDocuments.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-creco-primary no-underline hover:underline"
                    >
                      {doc.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/guidance?q=${encodeURIComponent(page.title)}`} className="creco-btn creco-btn-primary">
              Ask about this topic
            </Link>
            <Link href="/knowledge" className="creco-btn creco-btn-secondary">
              Back to knowledge hub
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
