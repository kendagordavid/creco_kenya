"use client";

import { useRef } from "react";
import { useParallaxLayer, usePrefersReducedMotion } from "@/lib/use-parallax";

type Props = {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
};

export function ParallaxGraphic({
  src,
  alt,
  speed = 0.36,
  className = "",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useParallaxLayer(sectionRef, layerRef, {
    speed,
    enabled: !reducedMotion,
  });

  return (
    <figure
      ref={sectionRef}
      className={`relative isolate overflow-hidden rounded-xl border border-creco-border bg-white ${className}`}
    >
      <div
        ref={layerRef}
        className="relative will-change-transform"
        style={{ marginTop: "-8%", marginBottom: "-8%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-auto w-full" draggable={false} />
      </div>
    </figure>
  );
}
