"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useParallaxLayer, usePrefersReducedMotion } from "@/lib/use-parallax";

type Overlay = "green" | "dark" | "none";

type Props = {
  imageSrc: string;
  imageAlt?: string;
  speed?: number;
  overlay?: Overlay;
  className?: string;
  priority?: boolean;
  children: ReactNode;
};

export function ParallaxBand({
  imageSrc,
  imageAlt = "",
  speed = 0.25,
  overlay = "green",
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
        <div ref={layerRef} className="creco-parallax-layer absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
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
