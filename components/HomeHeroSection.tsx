"use client";

import { HeroCarousel, type HeroCarouselCopy } from "@/components/HeroCarousel";
import { HeroQuickAccess, type HeroQuickAccessCopy } from "@/components/HeroQuickAccess";
import { HeroSideCards, type HeroSideCardCopy } from "@/components/HeroSideCards";

type Props = {
  hero: HeroCarouselCopy;
  sideCards: readonly HeroSideCardCopy[];
  quickAccess: HeroQuickAccessCopy;
};

export default function HomeHeroSection({ hero, sideCards, quickAccess }: Props) {
  return (
    <section className="bg-background pb-0 pt-6 dark:bg-background">
      <div className="creco-container creco-container--home">
        <div className="grid items-stretch gap-4 lg:h-[30rem] lg:grid-cols-[minmax(0,1fr)_minmax(16.5rem,20.5rem)]">
          <HeroCarousel copy={hero} />
          <div className="h-full min-h-0">
            <HeroSideCards cards={sideCards} />
          </div>
        </div>
        <div className="creco-animate-in creco-animate-in-delay-2">
          <HeroQuickAccess copy={quickAccess} />
        </div>
      </div>
    </section>
  );
}
