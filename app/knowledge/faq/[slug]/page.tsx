import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { getFaqBySlug } from "@/lib/content/faqs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const faq = getFaqBySlug(slug);
  return { title: faq?.question ?? "FAQ" };
}

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const faq = getFaqBySlug(slug);
  if (!faq) notFound();

  return (
    <>
      <PageHero eyebrow="FAQ" title={faq.question} variant="light" />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <div className="creco-prose">
            <p>{faq.answer}</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/guidance?q=${encodeURIComponent(faq.question)}`}
              className="creco-btn creco-btn-primary"
            >
              Ask related question
            </Link>
            <Link href="/knowledge/faq" className="creco-btn creco-btn-secondary">
              All FAQs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
