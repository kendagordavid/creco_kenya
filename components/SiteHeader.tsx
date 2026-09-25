"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SocialLinks } from "@/components/SocialLinks";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { UserMenu } from "@/components/UserMenu";
import { EN_TOPIC_COPY, SW_TOPIC_COPY } from "@/lib/content/topics";
import { completeSignOut } from "@/lib/auth-session-client";
import { useCurrentLocale, useTranslations } from "@/lib/i18n/client";
import {
  isPlatformNavActive,
  isPublicNavActive,
  NAV_MENUS,
  PLATFORM_NAV,
  PUBLIC_NAV,
  TOPIC_NAV,
} from "@/lib/nav";
import { cn } from "@/lib/utils";

type MenuItem = { href: string; label: string };

function menuForHref(
  href: string,
  topicItems: MenuItem[],
  labels: Record<string, string>,
): MenuItem[] {
  if (href === "/knowledge") return [];
  const menu = NAV_MENUS[href as keyof typeof NAV_MENUS];
  if (!menu) return [];
  const items = menu.map((item) => ({ href: item.href, label: labels[item.labelKey] ?? item.labelKey }));
  if (href === "/topics") {
    return [...items, ...topicItems];
  }
  return items;
}

function releaseStuckFocus(root: HTMLElement) {
  const active = document.activeElement;
  if (active instanceof HTMLElement && root.contains(active)) {
    active.blur();
  }
}

function NavDropdown({
  href,
  label,
  active,
  items,
}: {
  href: string;
  label: string;
  active: boolean;
  items: MenuItem[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      className="group/menu relative"
      onMouseLeave={() => {
        if (rootRef.current) releaseStuckFocus(rootRef.current);
      }}
    >
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        aria-haspopup="menu"
        onClick={() => {
          if (rootRef.current) releaseStuckFocus(rootRef.current);
        }}
        className={cn(
          "flex h-16 items-center gap-1 whitespace-nowrap border-b-2 px-2.5 text-sm font-medium no-underline transition-colors",
          active
            ? "border-creco-primary text-creco-primary"
            : "border-transparent text-creco-black-soft hover:text-creco-primary dark:text-foreground/80 dark:hover:text-creco-green-light",
        )}
      >
        {label}
        <ChevronDown
          className="size-4 transition-transform group-hover/menu:rotate-180 group-focus-within/menu:rotate-180"
          aria-hidden
        />
      </Link>
      <div
        role="menu"
        className="invisible absolute left-0 top-full z-50 min-w-72 rounded-lg border border-creco-border bg-background py-2 opacity-0 shadow-lg transition group-hover/menu:visible group-hover/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:opacity-100 dark:border-border"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            onClick={() => {
              if (rootRef.current) releaseStuckFocus(rootRef.current);
            }}
            className="block px-4 py-2.5 text-sm font-medium text-creco-black-soft no-underline hover:bg-creco-green-muted hover:text-creco-primary dark:text-foreground/80 dark:hover:bg-muted dark:hover:text-creco-green-light"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const t = useTranslations();
  const locale = useCurrentLocale();
  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;

    function handleClick(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  const topicCopy = locale === "sw" ? SW_TOPIC_COPY : EN_TOPIC_COPY;
  const topicItems = TOPIC_NAV.map((topic) => ({
    href: topic.href,
    label: topicCopy[topic.slug]?.title ?? topic.slug,
  }));

  const navItems = (isLoggedIn ? PLATFORM_NAV : PUBLIC_NAV).map((item) => ({
    href: item.href,
    label: t.nav[item.labelKey],
    active: isLoggedIn
      ? isPlatformNavActive(pathname, item.href)
      : isPublicNavActive(pathname, item.href),
    items: menuForHref(item.href, topicItems, t.nav.menu),
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-creco-border/90 bg-background/90 shadow-[0_1px_2px_rgba(10,10,10,0.04)] backdrop-blur-md dark:border-border dark:bg-background/90 dark:shadow-none">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center px-3 sm:px-8" style={{ paddingLeft: "max(0.75rem, env(safe-area-inset-left))", paddingRight: "max(0.75rem, env(safe-area-inset-right))" }}>
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
          ref={navRef}
          aria-label={isLoggedIn ? t.nav.platformNav : t.nav.sectionNav}
          className="ml-6 hidden items-center xl:flex"
        >
          {navItems.map((item) =>
            item.items.length > 0 ? (
              <NavDropdown
                key={item.href}
                href={item.href}
                label={item.label}
                active={item.active}
                items={item.items}
              />
            ) : (
              <NavLink key={item.href} href={item.href} label={item.label} active={item.active} />
            ),
          )}
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
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-creco-border bg-background px-4 py-3 dark:border-border xl:hidden"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                {item.items.length > 0 ? (
                  <div>
                    <button
                      type="button"
                      aria-expanded={openMenu === item.href}
                      onClick={() => setOpenMenu((current) => (current === item.href ? null : item.href))}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-between px-1 text-sm font-medium",
                        item.active ? "text-creco-primary" : "text-creco-black-soft dark:text-foreground/80",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("size-4 transition-transform", openMenu === item.href && "rotate-180")}
                        aria-hidden
                      />
                    </button>
                    {openMenu === item.href && (
                      <ul className="mb-2 space-y-1 border-l border-creco-border pl-3 dark:border-border">
                        {item.items.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="flex min-h-11 items-center text-sm text-creco-black-soft no-underline hover:text-creco-primary dark:text-foreground/80 dark:hover:text-creco-green-light"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    href={item.href}
                    label={item.label}
                    active={item.active}
                    onNavigate={() => setOpen(false)}
                    className="h-11 border-b-0 px-1"
                  />
                )}
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
