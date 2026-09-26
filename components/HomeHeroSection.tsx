"use client";

import { HeroCarousel, type HeroCarouselCopy } from "@/components/HeroCarousel";
import { HeroQuickAccess, type HeroQuickAccessCopy } from "@/components/HeroQuickAccess";

type Props = {
  hero: HeroCarouselCopy;
  quickAccess: HeroQuickAccessCopy;
};

export default function HomeHeroSection({ hero, quickAccess }: Props) {
  return (
    <section className="bg-background pb-0 pt-6 dark:bg-background">
      <div className="creco-container creco-container--home">
        <HeroCarousel copy={hero} />
        <div className="creco-animate-in creco-animate-in-delay-2">
          <HeroQuickAccess copy={quickAccess} />
        </div>
      </div>
    </section>
  );
}
