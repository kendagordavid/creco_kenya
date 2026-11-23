import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { WikiBody } from "@/components/WikiBody";
import { getFaq } from "@/lib/knowledge-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const faq = await getFaq(slug);
  return { title: faq?.question ?? "FAQ" };
}

export default async function FaqDetailPage({ params }: Props) {
  const { slug } = await params;
  const faq = await getFaq(slug);
  if (!faq) notFound();

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={faq.question}
        backgroundImage="/images/pages/knowledge-discussion.jpg"
        backgroundAlt="A Maasai woman speaking with a microphone to a community group in Kajiado County, Kenya"
      />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <WikiBody body={faq.answer} />
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
