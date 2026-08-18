"use client";

import Link from "next/link";
import { useFormat, useTranslations } from "@/lib/i18n/client";

export function SiteFooter() {
  const t = useTranslations();
  const format = useFormat();

  const platformLinks = [
    { href: "/guidance", label: t.footer.pboGuidance },
    { href: "/topics", label: t.footer.topicLibrary },
    { href: "/sources", label: t.footer.sourceDocuments },
  ];

  return (
    <footer className="mt-auto border-t border-creco-border bg-creco-surface dark:border-border dark:bg-card">
      <div className="creco-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-creco-primary text-sm font-bold text-white">
              C
            </span>
            <div>
              <p className="text-lg font-bold text-creco-black dark:text-foreground">CRECO Kenya</p>
              <p className="text-xs font-medium text-creco-muted dark:text-muted-foreground">PBO Act Platform</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-creco-muted">{t.footer.tagline}</p>
        </div>

        <div className="lg:col-span-3">
          <p className="text-sm font-semibold text-creco-black dark:text-foreground">{t.footer.platform}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {platformLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-creco-muted no-underline transition hover:text-creco-primary dark:text-muted-foreground dark:hover:text-creco-green-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="text-sm font-semibold text-creco-black dark:text-foreground">{t.footer.partnership}</p>
          <p className="mt-3 text-sm leading-relaxed text-creco-muted">{t.footer.partnershipText}</p>
        </div>
      </div>

      <div className="border-t border-creco-border">
        <div className="creco-container flex flex-col gap-2 py-5 text-xs text-creco-muted sm:flex-row sm:items-center sm:justify-between">
          <span>{format(t.footer.copyright, { year: new Date().getFullYear() })}</span>
          <span>{t.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
