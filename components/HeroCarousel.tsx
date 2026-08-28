"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import "./HeroCarousel.css";

const AUTO_ADVANCE_MS = 6000;

export type HeroSlide = {
  id: string;
  eyebrow: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
};

/** Kenyan / Black photos in /public/images/hero — replace with CRECO photos when ready. */
const HERO_SLIDE_CONFIG = [
  {
    id: "understand-the-law",
    ctaHref: "/topics",
    imageSrc: "/images/hero/understand-the-law.jpg",
  },
  {
    id: "register-correctly",
    ctaHref: "/guidance",
    imageSrc: "/images/hero/register-correctly.jpg",
  },
  {
    id: "stay-compliant",
    ctaHref: "/compliance",
    imageSrc: "/images/hero/stay-compliant.jpg",
  },
  {
    id: "ask-a-question",
    ctaHref: "/guidance?ask=1",
    imageSrc: "/images/hero/ask-a-question.jpg",
  },
  {
    id: "civic-space",
    ctaHref: "/monitoring",
    imageSrc: "/images/hero/civic-space.jpg",
  },
] as const;

type Props = {
  className?: string;
};

export function HeroCarousel({ className = "" }: Props) {
  const t = useTranslations();
  const format = useFormat();
  const slides = useMemo<HeroSlide[]>(
    () =>
      HERO_SLIDE_CONFIG.map((config, index) => {
        const copy = t.home.hero.slides[index];
        return {
          id: config.id,
          ctaHref: config.ctaHref,
          imageSrc: config.imageSrc,
          eyebrow: copy.eyebrow,
          headline: copy.headline,
          description: copy.description,
          ctaLabel: copy.ctaLabel,
          imageAlt: copy.imageAlt,
        };
      }),
    [t],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  const total = slides.length;

  const startAutoAdvance = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    if (total <= 1) return;

    timerRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, AUTO_ADVANCE_MS);
  }, [total]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total);
      startAutoAdvance();
    },
    [total, startAutoAdvance],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
      startAutoAdvance();
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [startAutoAdvance]);

  useEffect(() => {
    const nextIndex = (activeIndex + 1) % total;
    const preload = new window.Image();
    preload.src = slides[nextIndex].imageSrc;
  }, [activeIndex, slides, total]);

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  return (
    <section
      ref={carouselRef}
      className={`hero-carousel relative isolate h-[calc(100svh-4rem)] min-h-[32rem] w-full overflow-hidden bg-creco-green-deep text-white ${className}`.trim()}
      style={{ "--hero-carousel-auto-ms": `${AUTO_ADVANCE_MS}ms` } as React.CSSProperties}
      aria-roledescription="carousel"
      aria-label={t.home.hero.ariaLabel}
      tabIndex={0}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <article
              key={slide.id}
              id={`hero-slide-${slide.id}`}
              className={`hero-carousel__slide absolute inset-0${isActive ? " hero-carousel__slide--active" : ""}`}
              aria-roledescription="slide"
              aria-label={format(t.home.hero.slideOf, { current: index + 1, total })}
              aria-hidden={!isActive}
            >
              <div className="hero-carousel__photo-wrap">
                {isActive ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- full-bleed hero backgrounds need native img for reliable cover sizing */
                  <img
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    className="hero-carousel__photo"
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                ) : null}
              </div>

              <div className="hero-carousel__scrim pointer-events-none absolute inset-0 z-[1]" aria-hidden />

              <div className="absolute inset-0 z-20 flex items-end pb-24 md:items-center md:pb-20">
                <div className="creco-container w-full">
                  <div className="hero-carousel__copy max-w-xl rounded-2xl bg-black/30 p-6 backdrop-blur-sm sm:bg-black/20 md:bg-transparent md:p-0 md:backdrop-blur-none">
                    <span className="creco-eyebrow creco-eyebrow-light">{slide.eyebrow}</span>
                    <h1 className="mt-3 text-[clamp(2rem,4.8vw,3.125rem)] font-bold leading-[1.12] tracking-tight text-white drop-shadow-sm">
                      {slide.headline}
                    </h1>
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-white/95 sm:text-lg">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.ctaHref}
                      className="creco-btn creco-btn-accent mt-7 inline-flex"
                      tabIndex={isActive ? 0 : -1}
                    >
                      {slide.ctaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="creco-hero-grid pointer-events-none opacity-35" aria-hidden />

      <button
        type="button"
        className="hero-carousel__arrow absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 sm:inline-flex"
        onClick={goPrev}
        aria-label={t.home.hero.previousSlide}
      >
        <ChevronLeft className="size-6" aria-hidden />
      </button>

      <button
        type="button"
        className="hero-carousel__arrow absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 sm:inline-flex"
        onClick={goNext}
        aria-label={t.home.hero.nextSlide}
      >
        <ChevronRight className="size-6" aria-hidden />
      </button>

      <div
        className="hero-carousel__dots absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
        role="tablist"
        aria-label={t.home.hero.chooseSlide}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            className={`hero-carousel__dot${index === activeIndex ? " hero-carousel__dot--active" : ""}`}
            aria-label={format(t.home.hero.goToSlide, { number: index + 1, headline: slide.headline })}
            aria-selected={index === activeIndex}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {slides[activeIndex].headline}
      </p>
    </section>
  );
}
