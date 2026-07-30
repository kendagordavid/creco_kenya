"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/i18n/client";

export function SectionSubnav() {
  const pathname = usePathname();
  const t = useTranslations();

  const items = [
    { href: "/", label: t.nav.home },
    { href: "/guidance", label: t.nav.guidance },
    { href: "/topics", label: t.nav.topics },
    { href: "/sources", label: t.nav.sources },
  ];

  return (
    <nav
      aria-label={t.nav.sectionNav}
      className="border-b border-creco-border bg-creco-green-muted/40"
    >
      <div className="creco-container overflow-x-auto">
        <ul className="flex min-w-max gap-1 py-2">
          {items.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-4 py-2 text-sm font-semibold no-underline transition-colors ${
                    active
                      ? "bg-creco-primary text-white shadow-sm"
                      : "text-creco-black-soft/70 hover:bg-white hover:text-creco-black"
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
