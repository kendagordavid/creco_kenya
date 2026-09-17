import { HeroCarousel, type HeroCarouselCopy } from "@/components/HeroCarousel";
import { HeroQuickAccess, type HeroQuickAccessCopy } from "@/components/HeroQuickAccess";
import { HeroSideCards, type HeroSideCardCopy } from "@/components/HeroSideCards";

type Props = {
  carousel: HeroCarouselCopy;
  sideCards: readonly HeroSideCardCopy[];
  quickAccess: HeroQuickAccessCopy;
};

export function HomeHeroSection({ carousel, sideCards, quickAccess }: Props) {
  return (
    <section className="bg-white px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="creco-container">
        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
          <HeroCarousel copy={carousel} className="min-h-[20rem] lg:min-h-[24rem]" />
          <HeroSideCards cards={sideCards} />
        </div>
        <HeroQuickAccess copy={quickAccess} />
      </div>
    </section>
  );
}
