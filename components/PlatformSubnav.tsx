"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/lib/i18n/client";
import { isPlatformNavActive, PLATFORM_NAV } from "@/lib/nav";

/** Secondary nav for guests on module pages. Hidden when signed in — main header covers platform links. */
export function PlatformSubnav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const t = useTranslations();

  if (status !== "loading" && session?.user) {
    return null;
  }

  const items = PLATFORM_NAV.map((item) => ({
    href: item.href,
    label: t.nav[item.labelKey],
  }));

  return (
    <nav
      aria-label={t.nav.platformNav}
      className="border-b border-creco-border bg-creco-surface/80"
    >
      <div className="creco-container overflow-x-auto creco-scroll-x">
        <ul className="flex min-w-max snap-x snap-mandatory gap-1 py-2">
          {items.map((item) => {
            const active = isPlatformNavActive(pathname, item.href);
            return (
              <li key={item.href} className="snap-start">
                <Link
                  href={item.href}
                  className={`flex min-h-11 items-center rounded-lg px-3.5 text-sm font-semibold no-underline transition-colors ${
                    active
                      ? "bg-creco-primary text-white"
                      : "text-creco-black-soft hover:bg-white hover:text-creco-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
