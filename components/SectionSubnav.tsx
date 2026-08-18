"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/lib/i18n/client";
import { isPublicNavActive, PUBLIC_NAV } from "@/lib/nav";

/** Legacy section nav for guests on guidance/topics/sources. Hidden when signed in. */
export function SectionSubnav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const t = useTranslations();

  if (status !== "loading" && session?.user) {
    return null;
  }

  const items = PUBLIC_NAV.map((item) => ({
    href: item.href,
    label: t.nav[item.labelKey],
    active: isPublicNavActive(pathname, item.href),
  }));

  return (
    <nav
      aria-label={t.nav.sectionNav}
      className="border-b border-creco-border bg-creco-surface/80"
    >
      <div className="creco-container overflow-x-auto">
        <ul className="flex min-w-max gap-1 py-2.5">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-lg px-3.5 py-2 text-sm font-semibold no-underline transition-colors ${
                  item.active
                    ? "bg-creco-primary text-white"
                    : "text-creco-black-soft hover:bg-white hover:text-creco-primary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
