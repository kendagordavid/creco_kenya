import Link from "next/link";
import { ModuleCard } from "@/components/ModuleCard";
import { PageHero } from "@/components/PageHero";
import { getToolkitItems } from "@/lib/content/locale";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.complianceHub.metaTitle };
}

export default async function ComplianceHubPage() {
  const { locale, t } = await getServerTranslations();
  const toolkitItems = getToolkitItems(locale);

  return (
    <>
      <PageHero
        eyebrow={t.complianceHub.eyebrow}
        title={t.complianceHub.title}
        lead={t.complianceHub.lead}
        backgroundImage="/images/pages/compliance-documents.jpg"
        backgroundAlt="Hands signing a printed compliance document"
      />
      <section className="creco-section">
        <div className="creco-container">
          <div className="grid gap-5 md:grid-cols-2">
            <ModuleCard
              title={t.complianceHub.checklist.title}
              description={t.complianceHub.checklist.description}
              href="/compliance/checklist"
              imageSrc="/images/hero/stay-compliant.jpg"
              imageAlt="Black professional preparing compliance documentation"
            />
            <ModuleCard
              title={t.complianceHub.templates.title}
              description={t.complianceHub.templates.description}
              href="/compliance/templates"
              accent="orange"
              imageSrc="/images/pages/compliance-documents.jpg"
              imageAlt="Hands signing a printed compliance document"
            />
          </div>

          <div id="toolkit" className="mt-14 scroll-mt-24">
            <h2 className="text-xl font-bold text-creco-primary">{t.nav.menu.toolkit}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolkitItems.map((item) => (
                <li key={item.slug}>
                  <Link href={`/knowledge/toolkits/${item.slug}`} className="creco-card block h-full p-5 no-underline">
                    <h3 className="font-bold text-creco-primary">{item.title}</h3>
                    <p className="mt-2 text-sm text-creco-muted">{item.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-8 text-sm text-creco-muted">{t.footer.legalReviewed}</p>
        </div>
      </section>
    </>
  );
}
