import Link from "next/link";
import { FlagFeedbackForm } from "@/components/FlagFeedbackForm";
import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Flag guidance",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function FlagFeedbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const question = params.q?.trim() ?? "";

  return (
    <>
      <PageHero
        eyebrow="Guidance"
        title="Flag or feedback"
        lead="Help CRECO improve guidance answers when something looks wrong or unclear."
        variant="light"
      />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container">
          <FlagFeedbackForm defaultQuestion={question} />
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-creco-muted">
            Need a human follow-up?{" "}
            <Link href="/guidance/ask-creco" className="font-semibold text-creco-primary no-underline">
              Ask CRECO directly
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
