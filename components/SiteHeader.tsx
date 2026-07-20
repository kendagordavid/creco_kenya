"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/guidance", label: "Guidance" },
  { href: "/topics", label: "Topics" },
  { href: "/sources", label: "Sources" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-creco-border/80 bg-white/95 backdrop-blur-sm">
      <div className="creco-container flex items-center justify-between gap-6 py-4">
        <Link href="/" className="group flex items-center gap-3 no-underline">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-creco-primary text-sm font-bold text-white transition group-hover:bg-creco-primary-dark"
            aria-hidden
          >
            C
          </span>
          <span>
            <span className="block font-display text-lg font-bold leading-none text-creco-primary">
              CRECO
            </span>
            <span className="mt-0.5 block text-[0.7rem] font-medium tracking-wide text-creco-muted">
              PBO Act Platform
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="rounded-md p-2 text-creco-primary lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-1 border-b border-creco-border bg-white px-5 py-4 lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:p-0`}
        >
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`relative px-3 py-2 text-sm font-medium no-underline transition-colors ${
                  active ? "text-creco-primary" : "text-creco-muted hover:text-creco-primary"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-creco-accent lg:-bottom-1" />
                )}
              </Link>
            );
          })}
          <Link
            href="/guidance?ask=1"
            onClick={() => setOpen(false)}
            className="creco-btn creco-btn-accent mt-2 lg:ml-4 lg:mt-0"
          >
            Ask a question
          </Link>
        </nav>
      </div>
    </header>
  );
}
