type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  variant?: "green" | "light";
};

export function PageHero({ eyebrow, title, lead, variant = "green" }: Props) {
  if (variant === "light") {
    return (
      <section className="creco-hero-pattern">
        <div className="creco-container py-14 sm:py-16">
          {eyebrow && <span className="creco-eyebrow">{eyebrow}</span>}
          <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">{title}</h1>
          {lead && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-creco-muted sm:text-lg">
              {lead}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="creco-hero">
      <div className="creco-hero-grid" aria-hidden />
      <div className="creco-hero-inner creco-container py-14 sm:py-16 lg:py-20">
        {eyebrow && <span className="creco-eyebrow creco-eyebrow-light">{eyebrow}</span>}
        <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">{title}</h1>
        {lead && (
          <p className="creco-hero-lead mt-4 max-w-2xl text-base sm:text-lg">{lead}</p>
        )}
      </div>
    </section>
  );
}
