"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { isSuperuser } from "@/lib/authz";
import { isDashboardRoute } from "@/lib/nav";

export function UserMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (status === "loading") {
    return <span className="size-9 rounded-full bg-muted animate-pulse" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-creco-black-soft no-underline transition hover:bg-creco-green-muted hover:text-creco-primary"
        >
          {t.nav.login}
        </Link>
        <Link href="/register" className="creco-btn creco-btn-primary px-4 py-2 text-sm">
          {t.nav.register}
        </Link>
      </div>
    );
  }

  const initials =
    session.user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const firstName = session.user.name?.split(" ")[0] ?? "Account";
  const onDashboard = isDashboardRoute(pathname);

  const accountLinks = [
    { href: "/profile", label: t.nav.dashboard },
    { href: "/monitoring/submissions", label: t.nav.submissions },
    { href: "/profile/account", label: t.nav.account },
    ...(isSuperuser(session.user.role)
      ? [
          { href: "/admin/compliance", label: t.nav.orgProgress },
          { href: "/admin/reports", label: t.nav.allReports },
        ]
      : []),
  ] as const;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.nav.accountMenu}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition",
          open || onDashboard
            ? "border-creco-primary/30 bg-creco-green-muted"
            : "border-border bg-card hover:border-creco-primary/20 hover:bg-muted",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-creco-primary text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[7rem] truncate text-sm font-semibold text-foreground sm:block">
          {firstName}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg ring-1 ring-border/60"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-popover-foreground">{session.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
          </div>

          {accountLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-popover-foreground no-underline transition hover:bg-muted hover:text-creco-primary"
            >
              {item.label}
            </Link>
          ))}

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-popover-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" aria-hidden />
            {t.nav.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
