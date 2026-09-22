"use client";

import { useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const LINKS = [
  {
    id: "facebook",
    href: "https://www.facebook.com/crecokenya",
    labelKey: "socialFacebook",
  },
  {
    id: "x",
    href: "https://x.com/crecokenya",
    labelKey: "socialX",
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/company/constitution-and-reform-education-consortium-creco",
    labelKey: "socialLinkedIn",
  },
] as const;

function SocialIcon({ id }: { id: (typeof LINKS)[number]["id"] }) {
  if (id === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
        <path d="M14.5 8.5V6.8c0-.7.5-1.1 1.2-1.1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7Z" />
      </svg>
    );
  }
  if (id === "x") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
        <path d="M14.7 10.4 21.4 3h-1.6l-5.8 6.4L9.2 3H3.4l7 10-7 7.6h1.6l6.1-6.8 4.9 6.8h5.8l-7.1-10.2Zm-2.2 2.4-.7-1-5.6-7.7h2.4l4.5 6.2.7 1 5.9 8.1h-2.4l-4.8-6.6Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M6.5 9H4V20h2.5V9ZM5.2 3.5A1.6 1.6 0 1 0 5.2 6.7 1.6 1.6 0 0 0 5.2 3.5ZM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H11V9h2.4v1.5c.4-.7 1.3-1.8 3.2-1.8 2.3 0 4 1.5 4 4.8V20Z" />
    </svg>
  );
}

export function SocialLinks({
  className,
  nested = false,
  compact = false,
}: {
  className?: string;
  nested?: boolean;
  compact?: boolean;
}) {
  const t = useTranslations();
  const Tag = nested ? "div" : "nav";

  return (
    <Tag
      aria-label={t.a11y.socialNav}
      role={nested ? "group" : undefined}
      className={cn("flex items-center", compact ? "gap-0.5" : "gap-1", className)}
    >
      {LINKS.map((link) => (
        <a
          key={link.id}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.a11y[link.labelKey]}
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full text-creco-muted no-underline transition-colors hover:text-creco-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-creco-primary dark:text-muted-foreground dark:hover:text-creco-green-light",
            !compact && "hover:bg-creco-green-muted dark:hover:bg-muted",
          )}
        >
          <SocialIcon id={link.id} />
        </a>
      ))}
    </Tag>
  );
}
