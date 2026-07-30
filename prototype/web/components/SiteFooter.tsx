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
    <footer className="mt-auto bg-creco-black-soft text-white">
      <div className="h-1 bg-gradient-to-r from-creco-primary via-creco-accent to-creco-primary" aria-hidden />
      <div className="creco-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-creco-primary text-sm font-bold">
              C
            </span>
            <p className="text-xl font-bold text-white">CRECO Kenya</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{t.footer.tagline}</p>
        </div>
        <div className="lg:col-span-3">
          <p className="text-xs font-bold uppercase tracking-wider text-creco-accent">{t.footer.platform}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {platformLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/75 no-underline transition hover:text-creco-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4">
          <p className="text-xs font-bold uppercase tracking-wider text-creco-accent">
            {t.footer.partnership}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{t.footer.partnershipText}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="creco-container flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <span>{format(t.footer.copyright, { year: new Date().getFullYear() })}</span>
          <span>{t.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
