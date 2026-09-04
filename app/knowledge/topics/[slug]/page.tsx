import Link from "next/link";
import { AudioNarrationPlayer } from "@/components/AudioNarrationPlayer";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { WikiBody } from "@/components/WikiBody";
import { textForSpeech } from "@/lib/a11y/text-for-speech";
import { getCachedWikiPageBySlug } from "@/lib/cached-wiki";
import { getServerTranslations } from "@/lib/i18n/server";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getCachedWikiPageBySlug(slug);
  return { title: page?.title ?? "Topic" };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const { t } = await getServerTranslations();
  const page = await getCachedWikiPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <PageHero eyebrow={t.knowledgeHub.metaTitle} title={page.title} variant="light" />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <AudioNarrationPlayer text={textForSpeech(page.title, page.body)} className="mb-8" />
          <WikiBody body={page.body} />
          {page.sourceDocuments.length > 0 && (
            <aside className="creco-card mt-10 p-6">
              <h2 className="text-lg font-bold text-creco-primary">{t.sources.metaTitle}</h2>
              <ul className="mt-4 space-y-2">
                {page.sourceDocuments.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-creco-primary no-underline hover:underline"
                    >
                      {doc.title}
                      <span className="sr-only"> ({t.sources.viewPdf}, opens in new tab)</span>
                      <span aria-hidden> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/guidance?q=${encodeURIComponent(page.title)}`} className="creco-btn creco-btn-primary">
              {t.topics.askAbout}
            </Link>
            <Link href="/knowledge" className="creco-btn creco-btn-secondary">
              {t.nav.knowledge}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
