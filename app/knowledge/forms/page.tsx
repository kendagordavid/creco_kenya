import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { REGULATION_FORMS, formPreviewPaths } from "@/lib/content/regulation-forms";
import { getDictionary, getLocale, getServerTranslations, interpolate } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.formsPage.metaTitle };
}

export default async function FormsPage() {
  const { locale, t } = await getServerTranslations();

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
          <ul className="grid gap-4 sm:grid-cols-2">
            {REGULATION_FORMS.map((form) => {
              const name = locale === "sw" ? form.name.replace("Form", "Fomu") : form.name;
              const pages = formPreviewPaths(form).length;
              return (
                <li key={form.id}>
                  <Link
                    href={`/knowledge/forms/${form.id}`}
                    className="creco-card flex h-full gap-4 p-4 no-underline transition hover:border-creco-primary"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- small static preview */}
                    <img
                      src={formPreviewPaths(form)[0]}
                      alt=""
                      width={72}
                      height={102}
                      loading="lazy"
                      className="h-[102px] w-[72px] shrink-0 rounded border border-creco-border bg-white object-cover object-top"
                    />
                    <span className="min-w-0">
                      <span className="block font-bold text-creco-primary">{name}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-creco-muted">{form.purpose}</span>
                      <span className="mt-2 block text-xs font-semibold text-creco-black dark:text-foreground">
                        {t.formsPage.viewForm} ·{" "}
                        {pages === 1 ? t.formsPage.pageCountOne : interpolate(t.formsPage.pageCount, { count: pages })}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
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
