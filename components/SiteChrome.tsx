"use client";

import { usePathname } from "next/navigation";
import { SkipLink } from "@/components/SkipLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const AUTH_ROUTES = new Set(["/login", "/register", "/forgot-password"]);

export function SiteChrome({
  children,
  skipLinkLabel,
}: {
  children: React.ReactNode;
  skipLinkLabel: string;
}) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.has(pathname);

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <SkipLink label={skipLinkLabel} />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
