"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-parallax";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "li";
};

/**
 * Fades content in once, only after it scrolls into view.
 * Content stays visible if motion is reduced, scripting is off, or JS never arms the reveal.
 */
export function RevealOnScroll({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const reduce =
      reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !node || typeof IntersectionObserver === "undefined") {
      setPending(false);
      setVisible(false);
      return;
    }

    const rect = node.getBoundingClientRect();
    const alreadyInView = rect.bottom > 0 && rect.top < window.innerHeight * 0.92;
    if (alreadyInView) return;

    setPending(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.16, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      className={cn("creco-reveal", pending && "is-pending", visible && "is-visible", className)}
      style={delayMs > 0 && pending ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
