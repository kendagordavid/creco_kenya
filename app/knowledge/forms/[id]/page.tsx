import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import {
  REGULATION_FORMS,
  formPdfPath,
  formPreviewPaths,
  getRegulationForm,
} from "@/lib/content/regulation-forms";
import { getServerTranslations, interpolate } from "@/lib/i18n/server";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return REGULATION_FORMS.map((form) => ({ id: form.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const form = getRegulationForm(id);
  return { title: form ? `${form.name}: ${form.purpose}` : "Form" };
}

export default async function FormDetailPage({ params }: Props) {
  const { id } = await params;
  const form = getRegulationForm(id);
  if (!form) notFound();

  const { locale, t } = await getServerTranslations();
  const name = locale === "sw" ? form.name.replace("Form", "Fomu") : form.name;
  const previews = formPreviewPaths(form);

  return (
    <>
      <PageHero
        eyebrow={t.formsPage.eyebrow}
        title={name}
        lead={form.purpose}
        backgroundImage="/images/pages/knowledge-discussion.jpg"
        backgroundAlt={t.knowledgeHub.imageAlt}
      />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={formPdfPath(form)}
              download
              className="creco-btn creco-btn-primary"
            >
              {interpolate(t.formsPage.download, { form: name })}
            </a>
            <Link
              href="/knowledge/forms"
              className="creco-btn creco-btn-secondary"
            >
              {t.formsPage.backToForms}
            </Link>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-creco-muted">
            {t.formsPage.previewNote}
          </p>

          <ol className="mt-8 space-y-6">
            {previews.map((src, index) => (
              <li key={src}>
                {/* Opens the page on its own so it can be zoomed on a phone. */}
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- static scan of the gazetted form */}
                  <img
                    src={src}
                    alt={interpolate(t.formsPage.pageAlt, {
                      form: name,
                      page: index + 1,
                      total: previews.length,
                    })}
                    width={827}
                    height={1170}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-auto w-full rounded-lg border border-creco-border bg-white shadow-sm"
                  />
                </a>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm text-creco-muted">
            <a
              href="/documents/pbo-regulations-2026.pdf"
              className="font-semibold text-creco-primary no-underline"
            >
              {t.formsPage.regulationsLink}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
