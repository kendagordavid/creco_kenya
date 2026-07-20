import { GuidancePanel } from "@/components/GuidancePanel";
import { PageHero } from "@/components/PageHero";
import { SectionSubnav } from "@/components/SectionSubnav";

export const metadata = {
  title: "PBO Guidance",
};

type Props = {
  searchParams: Promise<{ q?: string; ask?: string }>;
};

export default async function GuidancePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialQuestion = params.q?.trim() ?? "";
  const autoOpen = params.ask === "1" || params.ask === "true";

  return (
    <>
      <PageHero
        eyebrow="Guidance tool"
        title="PBO Act guidance lookup"
        lead="Ask about registration, compliance, or the regulatory framework. Responses are drawn from compiled topic pages with references to approved source documents."
      />
      <SectionSubnav />
      <section className="creco-section creco-section-alt">
        <div className="creco-container">
          <GuidancePanel initialQuestion={initialQuestion} autoOpen={autoOpen} />
        </div>
      </section>
    </>
  );
}
