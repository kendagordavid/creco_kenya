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
    <nav
      aria-label="Section navigation"
      className="border-b border-creco-border bg-white/80 backdrop-blur-sm"
    >
      <div className="creco-container overflow-x-auto">
        <ul className="flex min-w-max gap-1.5 py-3">
          {ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-full px-4 py-2 text-sm font-semibold no-underline transition-all duration-200 ${
                    active
                      ? "bg-creco-primary text-white shadow-md shadow-creco-green/20"
                      : "text-creco-black-soft/70 hover:bg-creco-green-muted hover:text-creco-primary"
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
