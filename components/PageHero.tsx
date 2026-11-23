import Image from "next/image";

const HERO_BANNER_SRC = "/images/hero/mashirika-banner.jpg";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
};

/**
 * Inner-page hero on the shared Mashirika Law banner. Below `lg` the banner is
 * anchored left so only the dark pattern shows behind the copy; from `lg` up
 * it is anchored right so the Mashirika Law mark stays in view.
 */
export function PageHero({ eyebrow, title, lead }: Props) {
  return (
    <section className="creco-hero creco-hero--banner">
      <Image
        src={HERO_BANNER_SRC}
        alt=""
        fill
        sizes="100vw"
        quality={90}
        priority
        className="creco-hero-banner-img"
      />
      <div className="creco-hero-inner creco-container py-10 sm:py-16 lg:py-20">
        <div className="creco-hero-copy">
          {eyebrow && <span className="creco-eyebrow creco-eyebrow-light">{eyebrow}</span>}
          <h1 className="text-2xl font-bold sm:text-4xl lg:text-[2.75rem]">{title}</h1>
          {lead && <p className="creco-hero-lead mt-4 text-base sm:text-lg">{lead}</p>}
        </div>
      </div>
    </section>
  );
}
