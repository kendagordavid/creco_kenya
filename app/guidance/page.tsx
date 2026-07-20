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
        title="PBO Act guidance"
        lead="Ask a question in English or Kiswahili. Answers use CRECO’s compiled topics when they match, and AI (when configured) to synthesize guidance or fill gaps from general PBO Act context."
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
