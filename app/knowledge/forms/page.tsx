import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { REGULATION_FORMS } from "@/lib/content/regulation-forms";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.formsPage.metaTitle };
}

export default async function FormsPage() {
  const { t } = await getServerTranslations();

  return (
    <>
      <PageHero
        eyebrow={t.formsPage.eyebrow}
        title={t.formsPage.title}
        lead={t.formsPage.lead}
        backgroundImage="/images/pages/knowledge-discussion.jpg"
        backgroundAlt={t.knowledgeHub.imageAlt}
      />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <ul className="space-y-4">
            {REGULATION_FORMS.map((form) => (
              <li key={form.id} className="creco-card p-5">
                <h2 className="font-bold text-creco-primary">{form.name}</h2>
                <p className="mt-1 text-sm leading-relaxed text-creco-muted">{form.purpose}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-creco-muted">
            <Link href="/knowledge/topics/practical-compliance" className="font-semibold text-creco-primary no-underline">
              {t.formsPage.sourceLink}
            </Link>
            {" · "}
            <a href="/documents/pbo-regulations-2026.pdf" className="font-semibold text-creco-primary no-underline">
              {t.formsPage.regulationsLink}
            </a>
          </p>
          <p className="mt-4 text-sm text-creco-muted">{t.footer.legalReviewed}</p>
        </div>
      </section>
    </>
  );
}
