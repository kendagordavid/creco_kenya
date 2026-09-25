import { ParallaxBand } from "@/components/ParallaxBand";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  variant?: "green" | "light";
  backgroundImage?: string;
  backgroundAlt?: string;
  backgroundCredit?: string;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  variant = "green",
  backgroundImage,
  backgroundAlt = "",
  backgroundCredit,
}: Props) {
  if (variant === "light") {
    return (
      <section className="creco-hero-pattern">
        <div className="creco-container py-10 sm:py-16">
          {eyebrow && <span className="creco-eyebrow">{eyebrow}</span>}
          <h1 className="max-w-2xl text-2xl font-bold sm:text-4xl lg:text-[2.75rem]">{title}</h1>
          {lead && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-creco-muted sm:text-lg">
              {lead}
            </p>
          )}
        </div>
      </section>
    );
  }

  const copy = (
    <div className="creco-hero-inner creco-container py-10 sm:py-16 lg:py-20">
      {eyebrow && <span className="creco-eyebrow creco-eyebrow-light">{eyebrow}</span>}
      <h1 className="max-w-2xl text-2xl font-bold sm:text-4xl lg:text-[2.75rem]">{title}</h1>
      {lead && <p className="creco-hero-lead mt-4 max-w-2xl text-base sm:text-lg">{lead}</p>}
      {backgroundCredit && (
        <p className="pointer-events-none absolute bottom-5 right-4 max-w-[18rem] text-right text-[0.65rem] leading-snug text-white/75 sm:right-8">
          {backgroundCredit}
        </p>
      )}
    </div>
  );

  if (backgroundImage) {
    return (
      <ParallaxBand
        imageSrc={backgroundImage}
        imageAlt={backgroundAlt}
        overlay="green"
        speed={0.2}
        priority
        className="creco-hero creco-hero--photo"
      >
        {copy}
      </ParallaxBand>
    );
  }

  return (
    <section className="creco-hero">
      <div className="creco-hero-grid" aria-hidden />
      {copy}
    </section>
  );
}
