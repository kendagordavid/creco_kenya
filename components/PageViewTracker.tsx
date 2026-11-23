"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function trackingDeclined(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.doNotTrack === "1" || nav.globalPrivacyControl === true;
}

/**
 * Reports each public page view to /api/track for the staff visitor statistics.
 * No cookies or local storage are used; staff pages are not counted.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const sentReferrer = useRef(false);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return;
    if (trackingDeclined()) return;

    // Only the first page of a visit can have come from another site.
    const referrer = sentReferrer.current ? undefined : document.referrer || undefined;
    sentReferrer.current = true;

    const body = JSON.stringify({ path: pathname, referrer });
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon?.("/api/track", blob)) return;
    } catch {
      // Fall through to fetch.
    }
    void fetch("/api/track", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
