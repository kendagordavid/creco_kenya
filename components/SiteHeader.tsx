"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { UserMenu } from "@/components/UserMenu";
import { useTranslations } from "@/lib/i18n/client";
import {
  isPlatformNavActive,
  isPublicNavActive,
  PLATFORM_NAV,
  PUBLIC_NAV,
} from "@/lib/nav";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  active,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-semibold no-underline transition-colors",
        active
          ? "bg-creco-green-muted text-creco-primary"
          : "text-creco-black-soft hover:bg-creco-surface hover:text-creco-black",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const isLoggedIn = Boolean(session?.user);

  const navItems = isLoggedIn
    ? PLATFORM_NAV.map((item) => ({
        href: item.href,
        label: t.nav[item.labelKey],
        active: isPlatformNavActive(pathname, item.href),
      }))
    : PUBLIC_NAV.map((item) => ({
        href: item.href,
        label: t.nav[item.labelKey],
        active: isPublicNavActive(pathname, item.href),
      }));

  return (
    <header className="sticky top-0 z-50 border-b border-creco-border bg-white/95 backdrop-blur-md">
      <div className="creco-container flex h-16 items-center gap-4">
        <Link href={isLoggedIn ? "/profile" : "/"} className="group flex shrink-0 items-center gap-2.5 no-underline">
          <span
            className="flex size-10 items-center justify-center rounded-lg bg-creco-primary text-sm font-bold text-white"
            aria-hidden
          >
            C
          </span>
          <span className="hidden sm:block">
            <span className="block text-base font-bold leading-none text-creco-black">CRECO</span>
            <span className="mt-0.5 block text-[0.625rem] font-semibold uppercase tracking-wider text-creco-muted">
              PBO Act Platform
            </span>
          </span>
        </Link>

        <nav
          aria-label={isLoggedIn ? t.nav.platformNav : t.nav.sectionNav}
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
        >
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} active={item.active} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {!isLoggedIn && (
            <Link
              href="/guidance?ask=1"
              className="creco-btn creco-btn-accent hidden px-4 py-2 text-sm md:inline-flex"
            >
              {t.nav.askQuestion}
            </Link>
          )}

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <UserMenu />

          <button
            type="button"
            className="rounded-lg p-2 text-creco-black transition hover:bg-creco-green-muted lg:hidden"
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
      </div>

      {open && (
        <nav
          aria-label={isLoggedIn ? t.nav.platformNav : t.nav.sectionNav}
          className="border-t border-creco-border bg-white px-4 py-3 lg:hidden"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  active={item.active}
                  onNavigate={() => setOpen(false)}
                  className="block"
                />
              </li>
            ))}
          </ul>

          {!isLoggedIn && (
            <Link
              href="/guidance?ask=1"
              onClick={() => setOpen(false)}
              className="creco-btn creco-btn-accent mt-3 w-full text-sm"
            >
              {t.nav.askQuestion}
            </Link>
          )}

          <div className="mt-3 sm:hidden">
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
