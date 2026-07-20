type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
};

export function PageHero({ eyebrow, title, lead }: Props) {
  return (
    <section className="creco-hero-pattern border-b border-creco-border">
      <div className="creco-container py-12 sm:py-14">
        {eyebrow && <span className="creco-eyebrow">{eyebrow}</span>}
        <h1 className="max-w-2xl font-display text-3xl font-bold text-creco-primary sm:text-4xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-creco-muted sm:text-lg">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
