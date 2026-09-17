"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type HeroSideCardCopy = {
  title: string;
  cta: string;
  href: string;
  imageAlt: string;
  tone: string;
};

type Props = {
  cards: readonly HeroSideCardCopy[];
};

const CARD_IMAGES = [
  "/images/hero/stay-compliant.jpg",
  "/images/hero/register-correctly.jpg",
] as const;

const toneClasses = {
  green: "bg-creco-primary",
  navy: "bg-[#1e3a5f]",
} as const;

export function HeroSideCards({ cards }: Props) {
  return (
    <div className="grid h-full min-h-0 gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {cards.map((card, index) => (
        <Link
          key={card.href}
          href={card.href}
          className="group flex min-h-[11rem] flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-md ring-1 ring-black/5 no-underline transition hover:-translate-y-0.5 hover:shadow-lg lg:min-h-0 lg:flex-1"
        >
          <div className="relative h-32 overflow-hidden sm:h-28 lg:h-[58%]">
            <img
              src={CARD_IMAGES[index] ?? CARD_IMAGES[0]}
              alt={card.imageAlt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div
            className={`flex flex-1 flex-col justify-between gap-2 px-4 py-3.5 text-white ${toneClasses[card.tone as keyof typeof toneClasses] ?? toneClasses.green}`}
          >
            <h3 className="text-sm font-bold leading-snug sm:text-[0.95rem]">{card.title}</h3>
            <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-wide">
              {card.cta}
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/15">
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
