import Link from "next/link";
import { auth } from "@/auth";
import { ChecklistPanel } from "@/components/ChecklistPanel";
import { PageHero } from "@/components/PageHero";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.complianceHub.checklist.title };
}

export default async function ChecklistPage() {
  const session = await auth();
  const { t } = await getServerTranslations();

  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title={t.complianceHub.checklist.title}
        lead={t.complianceHub.checklist.description}
        backgroundImage="/images/hero/stay-compliant.jpg"
        backgroundAlt="Black professional preparing compliance documentation"
      />
      <section className="creco-section">
        <div className="creco-container max-w-3xl">
          <p className="creco-no-print mb-6 text-sm text-creco-muted">
            {session?.user ? (
              <>Progress syncs to your Mashariki Law account and stays available when you sign in on other devices.</>
            ) : (
              <>
                Progress is saved in this browser.{" "}
                <Link href="/login" className="font-semibold text-creco-primary no-underline">
                  Sign in
                </Link>{" "}
                to sync across devices.
              </>
            )}
          </p>
          <ChecklistPanel />
          <p className="mt-8 text-sm leading-relaxed text-creco-muted">
            <Link href="/compliance/assessment" className="font-semibold text-creco-primary no-underline">
              {t.complianceHub.assessment.title}
            </Link>
            {" — "}
            {t.complianceHub.assessment.description}
          </p>
        </div>
      </section>
    </>
  );
}
