"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  ClipboardList,
  FilePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  ShieldCheck,
  BarChart3,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import { isSuperuser } from "@/lib/authz";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

export function DashboardShell({ children, title, description }: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations();
  const format = useFormat();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const NAV: NavItem[] = [
    { href: "/profile", label: t.dashboard.overview, icon: LayoutDashboard, exact: true },
    { href: "/profile/account", label: t.nav.account, icon: Settings },
    { href: "/monitoring/submissions", label: t.nav.submissions, icon: ClipboardList },
    { href: "/monitoring", label: t.dashboard.submitReport, icon: FilePlus, exact: true },
    ...(isSuperuser(session?.user?.role)
      ? [
          { href: "/admin/compliance", label: t.nav.orgProgress, icon: BarChart3, exact: true },
          { href: "/admin/reports", label: t.nav.allReports, icon: ShieldCheck, exact: true },
        ]
      : []),
  ];

  const firstName = session?.user?.name?.split(" ")[0];
  const welcomeSuffix = firstName
    ? format(t.dashboard.welcomeSuffix, { name: firstName })
    : "";

  const initials = session?.user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  function isActive(item: NavItem) {
    const exact = item.exact;
    return exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  function navLinkClass(active: boolean, compact = false) {
    return cn(
      "flex items-center gap-2.5 rounded-lg font-medium no-underline transition-colors",
      compact ? "px-3 py-2.5 text-sm" : "gap-3 px-3 py-2.5 text-sm",
      active
        ? "bg-creco-primary text-white"
        : "text-foreground/80 hover:bg-muted hover:text-creco-primary",
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--creco-surface)]">
      <div
        className="border-b border-white/10 text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--creco-green-deep) 0%, var(--creco-green-dark) 55%, var(--creco-primary) 100%)",
        }}
      >
        <div className="creco-container py-6 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-creco-green-light">
                {t.dashboard.eyebrow}
              </p>
              <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-3xl">
                {format(t.dashboard.welcome, { suffix: welcomeSuffix })}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                {session?.user?.orgName
                  ? format(t.dashboard.orgLead, { orgName: session.user.orgName })
                  : t.dashboard.defaultLead}
              </p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-sm sm:self-auto">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-creco-primary">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {session?.user?.name ?? t.dashboard.account}
                </p>
                <p className="truncate text-xs text-white/65">{session?.user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="creco-container py-6 sm:py-10">
        {/* Mobile: hamburger nav */}
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            aria-expanded={mobileNavOpen}
            aria-controls="dashboard-mobile-nav"
            onClick={() => setMobileNavOpen((open) => !open)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground shadow-sm"
          >
            {mobileNavOpen ? (
              <X className="size-5 shrink-0" aria-hidden />
            ) : (
              <Menu className="size-5 shrink-0" aria-hidden />
            )}
            {t.dashboard.navLabel}
          </button>

          {mobileNavOpen && (
            <nav
              id="dashboard-mobile-nav"
              aria-label={t.dashboard.navLabel}
              className="mt-3 rounded-xl border border-border bg-card p-2 shadow-sm ring-1 ring-border/60"
            >
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const { href, label, icon: Icon } = item;
                  const active = isActive(item);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileNavOpen(false)}
                        className={navLinkClass(active)}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="my-2 border-t border-border" />
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-creco-muted no-underline transition-colors hover:bg-muted hover:text-foreground"
              >
                <Shield className="size-4" aria-hidden />
                {t.dashboard.backToPlatform}
              </Link>
              <Button
                type="button"
                variant="ghost"
                className="mt-1 w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="size-4" aria-hidden />
                {t.nav.signOut}
              </Button>
            </nav>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
            <nav
              aria-label={t.dashboard.navLabel}
              className="rounded-xl border border-border bg-card p-2 shadow-sm ring-1 ring-border/60"
            >
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const { href, label, icon: Icon } = item;
                  const active = isActive(item);
                  return (
                    <li key={href}>
                      <Link href={href} className={navLinkClass(active)}>
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="my-2 border-t border-border" />

              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-creco-muted no-underline transition-colors hover:bg-muted hover:text-foreground"
              >
                <Shield className="size-4" aria-hidden />
                {t.dashboard.backToPlatform}
              </Link>

              <Button
                type="button"
                variant="ghost"
                className="mt-1 w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="size-4" aria-hidden />
                {t.nav.signOut}
              </Button>
            </nav>

            <div className="mt-4 rounded-xl border border-creco-primary/30 bg-creco-green-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-creco-primary">
                {t.dashboard.confidential}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-creco-primary/80">
                {t.dashboard.confidentialNote}
              </p>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            {(title || description) && (
              <div>
                {title && (
                  <h2 className="text-xl font-bold tracking-tight text-creco-primary sm:text-2xl">
                    {title}
                  </h2>
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
