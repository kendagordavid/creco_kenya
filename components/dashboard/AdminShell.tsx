"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { completeSignOut } from "@/lib/auth-session-client";
import { useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof BarChart3;
  exact?: boolean;
};

export function AdminShell({ children, title, description }: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const NAV: NavItem[] = [
    { href: "/admin", label: t.adminConsole.nav.analytics, icon: BarChart3, exact: true },
    { href: "/admin/compliance", label: t.nav.orgProgress, icon: ClipboardCheck, exact: true },
    { href: "/admin/reports", label: t.nav.allReports, icon: ShieldCheck, exact: true },
    { href: "/admin/anonymous", label: t.nav.anonymousReports, icon: Megaphone, exact: true },
  ];

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "S";

  function isActive(item: NavItem) {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  function navLinkClass(active: boolean) {
    return cn("creco-staff-nav-link", active && "is-active");
  }

  return (
    <div className="creco-staff min-h-[calc(100vh-4rem)]">
      <div
        className="border-b border-white/10 text-white"
        style={{
          background: "linear-gradient(135deg, #3d220c 0%, #8a420c 52%, #ef9334 100%)",
        }}
      >
        <div className="h-1 bg-[#ffb366]" />
        <div className="creco-container py-6 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-creco-orange-light">
                {t.adminConsole.eyebrow}
              </p>
              <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-3xl">
                {t.adminConsole.title}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
                {t.adminConsole.lead}
              </p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-xl bg-white/10 p-3 ring-1 ring-white/15 sm:self-auto">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-creco-orange text-sm font-bold text-creco-black">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-creco-orange-light">
                  {t.adminConsole.staffOnly}
                </p>
                <p className="truncate text-sm font-semibold">{session?.user?.name ?? t.adminConsole.staff}</p>
                <p className="truncate text-xs text-white/60">{session?.user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="creco-container py-6 sm:py-10">
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            aria-expanded={mobileNavOpen}
            aria-controls="admin-mobile-nav"
            onClick={() => setMobileNavOpen((open) => !open)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground shadow-sm"
          >
            {mobileNavOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            {t.adminConsole.navLabel}
          </button>
          {mobileNavOpen && (
            <nav
              id="admin-mobile-nav"
              aria-label={t.adminConsole.navLabel}
              className="creco-staff-sidebar mt-3 border-border bg-card"
            >
              <ul className="space-y-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={navLinkClass(isActive(item))}
                    >
                      <item.icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="my-2 border-t border-border" />
              <Link
                href="/profile"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-creco-muted no-underline hover:bg-muted hover:text-foreground"
              >
                <LayoutDashboard className="size-4" aria-hidden />
                {t.adminConsole.myDashboard}
              </Link>
              <Button
                type="button"
                variant="ghost"
                className="mt-1 w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
                onClick={() => void completeSignOut("/")}
              >
                <LogOut className="size-4" aria-hidden />
                {t.nav.signOut}
              </Button>
            </nav>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
            <nav aria-label={t.adminConsole.navLabel} className="creco-staff-sidebar">
              <p className="px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-creco-orange-dark">
                {t.adminConsole.staffOnly}
              </p>
              <ul className="space-y-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={navLinkClass(isActive(item))}>
                      <item.icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="my-2 border-t border-border" />
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-creco-muted no-underline hover:bg-muted hover:text-foreground"
              >
                <LayoutDashboard className="size-4" aria-hidden />
                {t.adminConsole.myDashboard}
              </Link>
              <Button
                type="button"
                variant="ghost"
                className="mt-1 w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
                onClick={() => void completeSignOut("/")}
              >
                <LogOut className="size-4" aria-hidden />
                {t.nav.signOut}
              </Button>
            </nav>
          </aside>

          <div className="min-w-0 space-y-6">
            {(title || description) && (
              <div>
                {title && (
                  <h2 className="creco-staff-heading text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
                )}
                {description && (
                  <p className="mt-1 text-sm leading-relaxed text-creco-muted">{description}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
