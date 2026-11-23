import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SearchForm } from "@/components/SearchForm";
import { FAQ_CATEGORIES, faqSummary } from "@/lib/content/faqs";
import { getFaqs } from "@/lib/knowledge-content";

export const metadata = {
  title: "FAQs",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function FaqIndexPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  const items = await getFaqs(category);

  return (
    <>
      <PageHero
        eyebrow="Knowledge hub"
        title="Frequently asked questions"
        lead="Practical answers to help Kenyan PBOs understand their rights, meet their obligations, and strengthen transparency, accountability and good governance."
        backgroundImage="/images/pages/knowledge-discussion.jpg"
        backgroundAlt="A Maasai woman speaking with a microphone to a community group in Kajiado County, Kenya"
      />
      <section className="creco-section">
        <div className="creco-container">
          <SearchForm />

          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/knowledge/faq"
              className={`creco-btn text-sm ${!category ? "creco-btn-primary" : "creco-btn-secondary"}`}
            >
              All
            </Link>
            {FAQ_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/knowledge/faq?category=${cat.slug}`}
                className={`creco-btn text-sm ${
                  category === cat.slug ? "creco-btn-primary" : "creco-btn-secondary"
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </div>

          <ul className="mt-10 space-y-3">
            {items.map((faq) => (
              <li key={faq.slug}>
                <Link
                  href={`/knowledge/faq/${faq.slug}`}
                  className="creco-card block p-5 no-underline transition hover:border-creco-primary/30"
                >
                  <h2 className="font-bold text-creco-black">{faq.question}</h2>
                  <p className="mt-2 line-clamp-4 text-sm text-creco-muted">{faqSummary(faq.answer)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
