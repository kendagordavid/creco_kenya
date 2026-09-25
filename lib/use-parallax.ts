"use client";

import { useEffect, useState, type RefObject } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

type ParallaxOptions = {
  speed?: number;
  enabled?: boolean;
};

export function useParallaxLayer(
  sectionRef: RefObject<HTMLElement | null>,
  layerRef: RefObject<HTMLElement | null>,
  { speed = 0.25, enabled = true }: ParallaxOptions = {},
) {
  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer || !enabled) {
      if (layer) layer.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const factor = mobile ? Math.min(speed, 0.3) : speed;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewport) return;

      const offset = rect.top + rect.height / 2 - viewport / 2;
      layer.style.transform = `translate3d(0, ${offset * factor}px, 0)`;
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
  }, [sectionRef, layerRef, speed, enabled]);
}
