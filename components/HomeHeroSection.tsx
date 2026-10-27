"use client";

import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
import { HeroCarousel, type HeroCarouselCopy } from "@/components/HeroCarousel";
import { HeroQuickAccess, type HeroQuickAccessCopy } from "@/components/HeroQuickAccess";

type Props = {
  hero: HeroCarouselCopy;
  quickAccess: HeroQuickAccessCopy;
  ask: {
    label: string;
    description: string;
  };
};

export default function HomeHeroSection({ hero, quickAccess, ask }: Props) {
  return (
    <section className="bg-background pb-0 pt-6 dark:bg-background">
      <div className="creco-container creco-container--home">
        <HeroCarousel copy={hero} />
        <div className="creco-animate-in creco-animate-in-delay-1 mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <p className="text-sm text-creco-muted dark:text-muted-foreground sm:text-right">
            {ask.description}
          </p>
          <Link
            href="/guidance?ask=1"
            className="creco-btn creco-btn-accent inline-flex min-h-11 items-center justify-center gap-2 text-sm no-underline"
          >
            <MessageCircleQuestion className="size-4" aria-hidden />
            {ask.label}
          </Link>
        </div>
        <div className="creco-animate-in creco-animate-in-delay-2">
          <HeroQuickAccess copy={quickAccess} />
        </div>
      </div>
    </section>
  );
}
