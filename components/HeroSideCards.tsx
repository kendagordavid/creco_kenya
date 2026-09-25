"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HERO_SIDE_CARD_IMAGES } from "@/lib/hero-slides";
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
          className={`creco-rise${index > 0 ? " creco-rise-delay-1" : ""} group flex min-h-[11rem] flex-col overflow-hidden rounded-[1.25rem] bg-card shadow-md ring-1 ring-border no-underline transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:min-h-0 lg:flex-1`}
        >
          <div className="relative h-32 overflow-hidden sm:h-28 lg:h-[58%]">
            <Image
              src={HERO_SIDE_CARD_IMAGES[index] ?? HERO_SIDE_CARD_IMAGES[0]}
              alt={card.imageAlt}
              fill
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
              quality={90}
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <div
            className={`flex flex-1 flex-col justify-between gap-2 px-4 py-3.5 text-white ${toneClasses[card.tone as keyof typeof toneClasses] ?? toneClasses.green}`}
          >
            <h3 className="!text-white text-sm font-bold leading-snug sm:text-[0.95rem]">{card.title}</h3>
            <span className="inline-flex min-h-11 items-center gap-2 text-[0.7rem] font-bold uppercase tracking-wide">
              {card.cta}
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none">
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
