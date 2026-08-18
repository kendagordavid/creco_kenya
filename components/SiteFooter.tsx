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
    <footer className="mt-auto bg-creco-black text-white">
      <div className="creco-brand-stripe" aria-hidden />
      <div className="creco-container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-creco-primary to-creco-green-light text-sm font-bold shadow-lg">
              C
            </span>
            <div>
              <p className="text-xl font-bold text-white">CRECO Kenya</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-creco-accent">
                PBO Act Platform
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">{t.footer.tagline}</p>
        </div>

        <div className="lg:col-span-3">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-creco-accent">
            {t.footer.platform}
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {platformLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/70 no-underline transition-colors duration-200 hover:text-creco-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-creco-accent">
            {t.footer.partnership}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-white/65">{t.footer.partnershipText}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
            <span className="h-2 w-2 rounded-full bg-creco-primary" aria-hidden />
            ICNL Partner
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="creco-container flex flex-col gap-2 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>{format(t.footer.copyright, { year: new Date().getFullYear() })}</span>
          <span className="flex items-center gap-2">
            <span className="hidden h-px w-8 bg-white/15 sm:block" aria-hidden />
            {t.footer.disclaimer}
          </span>
        </div>
      </div>
    </footer>
  );
}
