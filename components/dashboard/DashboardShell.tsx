"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ClipboardList,
  FilePlus,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ShieldCheck,
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

export function DashboardShell({ children, title, description }: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations();
  const format = useFormat();

  const NAV = [
    { href: "/profile", label: t.dashboard.overview, icon: LayoutDashboard, exact: true },
    { href: "/profile/account", label: t.nav.account, icon: Settings },
    { href: "/monitoring/submissions", label: t.nav.submissions, icon: ClipboardList },
    { href: "/monitoring", label: t.dashboard.submitReport, icon: FilePlus, exact: true },
    ...(isSuperuser(session?.user?.role)
      ? [{ href: "/admin/reports", label: t.nav.allReports, icon: ShieldCheck, exact: true as const }]
      : []),
  ] as const;

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--creco-surface)]">
      {/* Top welcome band */}
      <div
        className="border-b border-white/10 text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--creco-green-deep) 0%, var(--creco-green-dark) 55%, var(--creco-primary) 100%)",
        }}
      >
        <div className="creco-container py-8 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-creco-green-light">
                {t.dashboard.eyebrow}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {format(t.dashboard.welcome, { suffix: welcomeSuffix })}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                {session?.user?.orgName
                  ? format(t.dashboard.orgLead, { orgName: session.user.orgName })
                  : t.dashboard.defaultLead}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-sm">
              <span className="flex size-12 items-center justify-center rounded-lg bg-white text-sm font-bold text-creco-primary">
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

      <div className="creco-container py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <nav
              aria-label={t.dashboard.navLabel}
              className="rounded-xl border border-creco-border bg-white p-2 shadow-sm ring-1 ring-black/5"
            >
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const { href, label, icon: Icon } = item;
                  const exact = "exact" in item && item.exact;
                  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors",
                          active
                            ? "bg-creco-primary text-white"
                            : "text-creco-black-soft hover:bg-[var(--creco-green-muted)] hover:text-creco-primary",
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="my-2 border-t border-creco-border" />

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

            <div className="mt-4 hidden rounded-xl border border-creco-primary/30 bg-creco-green-muted p-4 lg:block">
              <p className="text-xs font-bold uppercase tracking-wider text-creco-primary">
                {t.dashboard.confidential}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-creco-primary/80">
                {t.dashboard.confidentialNote}
              </p>
            </div>
          </aside>

          {/* Main */}
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
