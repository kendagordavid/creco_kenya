"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useParallaxLayer, usePrefersReducedMotion } from "@/lib/use-parallax";

type Overlay = "green" | "green-light" | "dark" | "none";

type Props = {
  imageSrc: string;
  imageAlt?: string;
  speed?: number;
  overlay?: Overlay;
  /** Taller background layer for multi-block sections */
  tallBackground?: boolean;
  className?: string;
  priority?: boolean;
  children: ReactNode;
};

export function ParallaxBand({
  imageSrc,
  imageAlt = "",
  speed = 0.25,
  overlay = "green",
  tallBackground = false,
  className,
  priority = false,
  children,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const decorative = imageAlt.trim().length === 0;

  useParallaxLayer(sectionRef, layerRef, {
    speed,
    enabled: !reducedMotion,
  });

  return (
    <section ref={sectionRef} className={cn("relative isolate overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden={decorative || undefined}>
        <div
          ref={layerRef}
          className={cn(
            "creco-parallax-layer absolute inset-x-0 will-change-transform",
            tallBackground ? "-top-[16%] h-[132%]" : "-top-[12%] h-[124%]",
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            quality={90}
            priority={priority}
            className="object-cover object-center"
          />
        </div>
        {overlay !== "none" && (
          <div className={`creco-parallax-overlay creco-parallax-overlay--${overlay}`} aria-hidden />
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
