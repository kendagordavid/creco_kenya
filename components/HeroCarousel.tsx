"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useFormat } from "@/lib/i18n/client";
import { usePrefersReducedMotion } from "@/lib/use-parallax";
import "./HeroCarousel.css";

const AUTO_ADVANCE_MS = 6000;

export type HeroSlideCopy = {
  eyebrow: string;
  headline: string;
  description: string;
  ctaLabel: string;
  imageAlt: string;
};

export type HeroCarouselCopy = {
  ariaLabel: string;
  previousSlide: string;
  nextSlide: string;
  chooseSlide: string;
  goToSlide: string;
  slideOf: string;
  slides: readonly HeroSlideCopy[];
};

const HERO_SLIDE_CONFIG = [
  { id: "understand-the-law", ctaHref: "/topics", imageSrc: "/images/hero/understand-the-law.jpg" },
  { id: "register-correctly", ctaHref: "/guidance", imageSrc: "/images/hero/register-correctly.jpg" },
  { id: "stay-compliant", ctaHref: "/compliance", imageSrc: "/images/hero/stay-compliant.jpg" },
  { id: "ask-a-question", ctaHref: "/guidance?ask=1", imageSrc: "/images/hero/ask-a-question.jpg" },
  { id: "civic-space", ctaHref: "/monitoring", imageSrc: "/images/hero/civic-space.jpg" },
] as const;

type Props = {
  copy: HeroCarouselCopy;
  className?: string;
};

export function HeroCarousel({ copy, className = "" }: Props) {
  const format = useFormat();
  const slides = useMemo(
    () =>
      HERO_SLIDE_CONFIG.map((config, index) => ({
        id: config.id,
        ctaHref: config.ctaHref,
        imageSrc: config.imageSrc,
        ...copy.slides[index],
      })),
    [copy.slides],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const total = slides.length;

  const startAutoAdvance = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (total <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

  function pauseAutoAdvance() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    if (!reducedMotion) {
      startAutoAdvance();
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [startAutoAdvance, reducedMotion]);

  useEffect(() => {
    const section = carouselRef.current;
    if (!section || reducedMotion) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const factor = mobile ? 0.12 : 0.22;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewport) return;
      const offset = rect.top + rect.height / 2 - viewport / 2;
      const y = offset * factor;
      section.querySelectorAll<HTMLElement>(".hero-carousel__parallax").forEach((layer) => {
        layer.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  useEffect(() => {
    slides.forEach((slide, index) => {
      if (index === activeIndex || index === (activeIndex + 1) % total) {
        const preload = new window.Image();
        preload.src = slide.imageSrc;
      }
    });
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

  const activeSlide = slides[activeIndex];

  return (
    <section
      ref={carouselRef}
      className={`hero-carousel ${className}`.trim()}
      style={{ "--hero-carousel-auto-ms": `${AUTO_ADVANCE_MS}ms` } as React.CSSProperties}
      aria-roledescription="carousel"
      aria-label={copy.ariaLabel}
      tabIndex={0}
      onMouseEnter={pauseAutoAdvance}
      onMouseLeave={() => {
        if (!reducedMotion) startAutoAdvance();
      }}
      onFocus={pauseAutoAdvance}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !reducedMotion) {
          startAutoAdvance();
        }
      }}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <article
            key={slide.id}
            id={`hero-slide-${slide.id}`}
            className={`hero-carousel__slide${isActive ? " hero-carousel__slide--active" : ""}`}
            aria-roledescription="slide"
            aria-label={format(copy.slideOf, { current: index + 1, total })}
            aria-hidden={!isActive}
          >
            <div className="hero-carousel__panel">
              <div className="hero-carousel__pattern" aria-hidden />
              <div className="hero-carousel__copy">
                <p className="hero-carousel__eyebrow">{slide.eyebrow}</p>
                <h2 className="hero-carousel__headline">{slide.headline}</h2>
                <p className="hero-carousel__description">{slide.description}</p>
                <Link
                  href={slide.ctaHref}
                  className="hero-carousel__cta"
                  tabIndex={isActive ? 0 : -1}
                >
                  <span className="hero-carousel__cta-icon" aria-hidden>
                    <ArrowRight className="size-4" />
                  </span>
                  <span className="hero-carousel__cta-label">{slide.ctaLabel}</span>
                </Link>
              </div>
            </div>

            <div className="hero-carousel__media">
              <div className="hero-carousel__parallax">
                <Image
                  src={slide.imageSrc}
                  alt={isActive ? slide.imageAlt : ""}
                  aria-hidden={!isActive}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="hero-carousel__photo"
                  priority={index === 0}
                />
              </div>
            </div>
          </article>
        );
      })}

      {total > 1 && (
        <div className="hero-carousel__nav">
          <div className="hero-carousel__dots" role="tablist" aria-label={copy.chooseSlide}>
            {slides.map((slide, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={format(copy.goToSlide, { number: index + 1, headline: slide.headline })}
                  className={`hero-carousel__dot${selected ? " hero-carousel__dot--active" : ""}`}
                  onClick={() => goTo(index)}
                />
              );
            })}
          </div>
          <div className="hero-carousel__controls">
            <button
              type="button"
              className="hero-carousel__arrow"
              onClick={goPrev}
              aria-label={copy.previousSlide}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              className="hero-carousel__arrow"
              onClick={goNext}
              aria-label={copy.nextSlide}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {activeSlide?.headline}
      </p>
    </section>
  );
}
