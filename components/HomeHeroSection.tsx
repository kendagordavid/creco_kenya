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
    <section className="bg-white pb-8 pt-6">
      <div className="creco-container creco-container--home">
        <div className="grid items-stretch gap-4 lg:h-[30rem] lg:grid-cols-[minmax(0,1fr)_minmax(16.5rem,20.5rem)]">
          <HeroCarousel copy={hero} />
          <HeroSideCards cards={sideCards} />
        </div>
        <HeroQuickAccess copy={quickAccess} />
      </div>
    </section>
  );
}
