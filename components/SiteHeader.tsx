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
    <header className="sticky top-0 z-50 border-b border-creco-border/80 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="creco-brand-stripe" aria-hidden />
      <div className="creco-container flex items-center justify-between gap-6 py-3.5">
        <Link href="/" className="group flex items-center gap-3 no-underline">
          <span
            className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-creco-primary to-creco-green-light text-base font-bold text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-creco-green/25"
            aria-hidden
          >
            <span className="relative z-10">C</span>
            <span className="absolute inset-0 bg-gradient-to-br from-creco-accent/0 to-creco-accent/30 opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span>
            <span className="block text-lg font-bold leading-none tracking-tight text-creco-black">
              CRECO
            </span>
            <span className="mt-0.5 block text-[0.625rem] font-bold uppercase tracking-[0.18em] text-creco-primary">
              PBO Act Platform
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="rounded-lg p-2.5 text-creco-black transition hover:bg-creco-green-muted lg:hidden"
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
          } absolute left-0 right-0 top-full flex-col gap-1 border-b border-creco-border bg-white px-5 py-4 shadow-xl lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
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
                className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold no-underline transition-all duration-200 ${
                  active
                    ? "bg-creco-green-muted text-creco-primary"
                    : "text-creco-black-soft/75 hover:bg-creco-surface hover:text-creco-black"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-creco-accent lg:-bottom-0.5"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/guidance?ask=1"
            onClick={() => setOpen(false)}
            className="creco-btn creco-btn-accent mt-2 text-sm lg:ml-4 lg:mt-0"
          >
            Ask a question
          </Link>
        </nav>
      </div>
    </header>
  );
}
