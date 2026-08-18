import type { Metadata } from "next";
import { AiSetupNotice } from "@/components/AiSetupNotice";
import { GuidancePanel } from "@/components/GuidancePanel";
import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.guidance.metaTitle };
}

type Props = {
  searchParams: Promise<{ q?: string; ask?: string }>;
};

export default async function GuidancePage({ searchParams }: Props) {
  const { t } = await getServerTranslations();
  const params = await searchParams;
  const initialQuestion = params.q?.trim() ?? "";
  const autoOpen = params.ask === "1" || params.ask === "true";

  return (
    <>
      <PageHero eyebrow={t.guidance.eyebrow} title={t.guidance.title} lead={t.guidancePage.lead} />
      <SectionSubnav />
      <section className="creco-section creco-section-alt">
        <div className="creco-container">
          <AiSetupNotice />
          <GuidancePanel initialQuestion={initialQuestion} autoOpen={autoOpen} />
          <p className="mx-auto mt-10 max-w-xl text-center text-sm text-creco-muted">
            {t.guidancePage.somethingWrong}{" "}
            <a href="/guidance/flag" className="font-semibold text-creco-primary no-underline">
              {t.guidancePage.flagFeedback}
            </a>
            {" · "}
            <a href="/guidance/ask-creco" className="font-semibold text-creco-primary no-underline">
              {t.guidancePage.askCreco}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
