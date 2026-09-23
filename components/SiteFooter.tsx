"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useFormat, useTranslations } from "@/lib/i18n/client";

const linkClassName =
  "inline-flex min-h-8 items-center text-sm text-creco-muted no-underline transition hover:text-creco-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-creco-primary focus-visible:ring-offset-2 dark:text-muted-foreground dark:hover:text-creco-green-light";

export function SiteFooter() {
  const t = useTranslations();
  const format = useFormat();

  const columns = [
    {
      heading: t.footer.columns.aboutUs,
      ariaLabel: t.a11y.footerAboutNav,
      links: [
        { href: "/about", label: t.footer.links.whoWeAre },
        { href: "/about#partnership", label: t.footer.links.icnlPartnership },
        { href: "/privacy", label: t.footer.links.dataPrivacy },
        { href: "/contact", label: t.footer.links.contact },
      ],
    },
    {
      heading: t.footer.columns.registerPbo,
      ariaLabel: t.a11y.footerRegisterNav,
      links: [
        { href: "/knowledge/topics/registration-process-and-timeline", label: t.footer.links.process },
        { href: "/knowledge/topics/what-is-a-pbo", label: t.footer.links.function },
        { href: "/knowledge/topics/registration-requirements", label: t.footer.links.requirements },
        { href: "/knowledge/toolkits/registration-starter-pack", label: t.footer.links.toolKit },
      ],
    },
    {
      heading: t.footer.columns.stayCompliant,
      ariaLabel: t.a11y.footerCompliantNav,
      links: [
        { href: "/compliance/checklist", label: t.footer.links.checklist },
        { href: "/compliance/assessment", label: t.footer.links.selfAssessment },
        { href: "/compliance/templates", label: t.footer.links.templates },
      ],
    },
    {
      heading: t.footer.columns.getAnswers,
      ariaLabel: t.a11y.footerAnswersNav,
      links: [
        { href: "/guidance", label: t.footer.links.guidanceTools },
        { href: "/knowledge/faq", label: t.footer.links.faqs },
        { href: "/guidance/ask-creco", label: t.footer.links.askCrecoDirectly },
      ],
    },
    {
      heading: t.footer.columns.reportAnIssue,
      ariaLabel: t.a11y.footerReportNav,
      links: [
        { href: "/monitoring", label: t.footer.links.experiences },
        { href: "/monitoring/enabling", label: t.footer.links.evolvingPractices },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-creco-border bg-creco-surface dark:border-border dark:bg-card">
      <div className="creco-container grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-[minmax(13rem,1.4fr)_repeat(5,minmax(0,1fr))]">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-creco-primary text-sm font-bold text-white"
              aria-hidden
            >
              C
            </span>
            <div>
              <p className="text-lg font-bold text-creco-black dark:text-foreground">CRECO Kenya</p>
              <p className="text-xs font-medium text-creco-muted dark:text-muted-foreground">
                PBO Act Platform
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
            {t.footer.tagline}
          </p>
          <Link
            href="/guidance?ask=1"
            className="mt-1 inline-flex min-h-8 items-center gap-1 text-sm font-medium text-creco-primary no-underline transition hover:text-creco-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-creco-primary focus-visible:ring-offset-2 dark:hover:text-creco-green-light"
          >
            {t.footer.askCrecoCta}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.ariaLabel}>
            <h2 className="text-sm font-semibold text-creco-black dark:text-foreground">
              {column.heading}
            </h2>
            <ul className="mt-2">
              {column.links.map((link) => (
                <li key={`${column.heading}-${link.href}`}>
                  <Link href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-creco-border dark:border-border">
        <div className="creco-container flex flex-col gap-2 py-4 text-xs text-creco-muted dark:text-muted-foreground">
          <p>{t.footer.partnershipText}</p>
          <p>{format(t.footer.copyright, { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
