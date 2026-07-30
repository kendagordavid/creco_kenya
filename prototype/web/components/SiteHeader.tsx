"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "@/lib/i18n/client";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/guidance", label: t.nav.guidance },
    { href: "/topics", label: t.nav.topics },
    { href: "/sources", label: t.nav.sources },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-creco-border bg-white/98 shadow-sm backdrop-blur-md">
      <div className="h-1 bg-gradient-to-r from-creco-primary via-creco-accent to-creco-primary" aria-hidden />
      <div className="creco-container flex items-center justify-between gap-6 py-3.5">
        <Link href="/" className="group flex items-center gap-3 no-underline">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-creco-primary text-base font-bold text-white shadow-md transition group-hover:bg-creco-primary-dark group-hover:shadow-lg"
            aria-hidden
          >
            C
          </span>
          <span>
            <span className="block text-lg font-bold leading-none text-creco-black">CRECO</span>
            <span className="mt-0.5 block text-[0.65rem] font-semibold uppercase tracking-widest text-creco-primary">
              PBO Act Platform
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="rounded-lg p-2.5 text-creco-black transition hover:bg-creco-surface"
            aria-label={t.nav.toggleNav}
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
        </div>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-1 border-b border-creco-border bg-white px-5 py-4 shadow-lg lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold no-underline transition-colors ${
                  active
                    ? "bg-creco-green-muted text-creco-primary"
                    : "text-creco-black-soft/70 hover:bg-creco-surface hover:text-creco-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/guidance?ask=1"
            onClick={() => setOpen(false)}
            className="creco-btn creco-btn-accent mt-2 lg:ml-3 lg:mt-0"
          >
            {t.nav.askQuestion}
          </Link>
          <div className="mt-2 hidden lg:ml-3 lg:mt-0 lg:block">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
