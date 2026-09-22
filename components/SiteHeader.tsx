"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SocialLinks } from "@/components/SocialLinks";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { UserMenu } from "@/components/UserMenu";
import { completeSignOut } from "@/lib/auth-session-client";
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
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-16 shrink-0 items-center whitespace-nowrap border-b-2 px-2.5 text-sm font-medium no-underline transition-colors",
        active
          ? "border-creco-primary text-creco-primary"
          : "border-transparent text-creco-black-soft hover:text-creco-primary dark:text-foreground/80 dark:hover:text-creco-green-light",
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
    <header className="sticky top-0 z-50 border-b border-creco-border/90 bg-background/90 shadow-[0_1px_2px_rgba(10,10,10,0.04)] backdrop-blur-md dark:border-border dark:bg-background/90 dark:shadow-none">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center px-5 sm:px-8">
        <Link
          href="/"
          aria-label={t.a11y.homeLink}
          className="group flex shrink-0 items-center gap-2.5 no-underline"
        >
          <span
            className="flex size-10 items-center justify-center rounded-lg bg-creco-primary text-sm font-bold text-white"
            aria-hidden
          >
            C
          </span>
          <span className="hidden sm:block">
            <span className="block text-base font-bold leading-none text-creco-black dark:text-foreground">CRECO</span>
            <span className="mt-0.5 block text-[0.625rem] font-semibold uppercase tracking-wider text-creco-muted dark:text-muted-foreground">
              PBO Act Platform
            </span>
          </span>
        </Link>

        <nav
          aria-label={isLoggedIn ? t.nav.platformNav : t.nav.sectionNav}
          className="ml-6 hidden items-center xl:flex"
        >
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} active={item.active} />
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center">
          <SocialLinks compact className="ml-4 hidden xl:flex" />
          <Link
            href="/contact"
            className="hidden h-16 shrink-0 items-center whitespace-nowrap px-2.5 text-sm font-medium text-creco-black-soft no-underline transition-colors hover:text-creco-primary xl:inline-flex dark:text-foreground/80 dark:hover:text-creco-green-light"
          >
            {t.nav.contact}
          </Link>
          <span
            className="mx-2 hidden h-4 w-px bg-creco-border xl:block dark:bg-border"
            aria-hidden
          />
          <div className="hidden items-center gap-2 sm:flex">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          <div className={cn(!isLoggedIn && "hidden sm:block")}>
            <UserMenu />
          </div>

          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-creco-black transition hover:bg-creco-green-muted dark:text-foreground dark:hover:bg-muted xl:hidden"
            aria-label={t.nav.toggleNav}
            aria-expanded={open}
            aria-controls="mobile-primary-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-[22px]" aria-hidden />
            ) : (
              <Menu className="size-[22px]" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-primary-nav"
          aria-label={isLoggedIn ? t.nav.platformNav : t.nav.sectionNav}
          className="border-t border-creco-border bg-background px-4 py-3 dark:border-border xl:hidden"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  active={item.active}
                  onNavigate={() => setOpen(false)}
                  className="h-11 border-b-0 px-1"
                />
              </li>
            ))}
          </ul>

          <div className="mt-2 flex items-center gap-1 border-t border-creco-border pt-2 dark:border-border">
            <SocialLinks nested compact />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-creco-black-soft no-underline transition-colors hover:text-creco-primary dark:text-foreground/80 dark:hover:text-creco-green-light"
            >
              {t.nav.contact}
            </Link>
          </div>

          {!isLoggedIn && (
            <>
              <Link
                href="/guidance?ask=1"
                onClick={() => setOpen(false)}
                className="creco-btn creco-btn-accent mt-3 w-full text-sm md:hidden"
              >
                {t.nav.askQuestion}
              </Link>
              <div className="mt-3 flex flex-col gap-2 sm:hidden">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-lg border border-creco-border px-4 text-sm font-semibold text-creco-black-soft no-underline transition hover:bg-creco-green-muted hover:text-creco-primary dark:border-border dark:text-foreground dark:hover:bg-muted dark:hover:text-creco-green-light"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="creco-btn creco-btn-primary flex min-h-11 w-full justify-center text-sm"
                >
                  {t.nav.register}
                </Link>
              </div>
            </>
          )}

          {isLoggedIn && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void completeSignOut("/");
              }}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 text-sm font-semibold text-destructive transition hover:bg-destructive/10 sm:hidden"
            >
              <LogOut className="size-4" aria-hidden />
              {t.nav.signOut}
            </button>
          )}

          <div className="mt-3 flex items-center gap-2 sm:hidden">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
