"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/guidance", label: "Guidance" },
  { href: "/topics", label: "Topics" },
  { href: "/sources", label: "Sources" },
];

export function SectionSubnav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Section navigation" className="border-b border-creco-border bg-white">
      <div className="creco-container overflow-x-auto">
        <ul className="flex min-w-max gap-6">
          {ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative block py-3.5 text-sm font-medium no-underline transition-colors ${
                    active ? "text-creco-primary" : "text-creco-muted hover:text-creco-primary"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-creco-accent rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
