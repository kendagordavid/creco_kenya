"use client";

import Link from "next/link";
import { BookOpen, Shield, Users } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useFormat, useTranslations } from "@/lib/i18n/client";

type Props = {
  children: React.ReactNode;
};

export function AuthShell({ children }: Props) {
  const t = useTranslations();
  const format = useFormat();

  const highlights = [
    {
      id: "guidance",
      icon: Shield,
      title: t.authShell.highlights.guidance.title,
      description: t.authShell.highlights.guidance.description,
    },
    {
      id: "organisations",
      icon: Users,
      title: t.authShell.highlights.organisations.title,
      description: t.authShell.highlights.organisations.description,
    },
    {
      id: "plainLanguage",
      icon: BookOpen,
      title: t.authShell.highlights.plainLanguage.title,
      description: t.authShell.highlights.plainLanguage.description,
    },
  ];

  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14"
        style={{
          background:
            "linear-gradient(165deg, var(--creco-green-deep) 0%, var(--creco-green-dark) 50%, var(--creco-primary) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(10,134,77,0.35) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(239,147,52,0.12) 0%, transparent 40%)",
          }}
        />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 no-underline">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-lg font-bold ring-1 ring-white/20 backdrop-blur-sm">
              C
            </span>
            <span>
              <span className="block text-lg font-bold leading-none">CRECO Kenya</span>
              <span className="mt-1 block text-[0.625rem] font-bold uppercase tracking-[0.2em] text-creco-green-light">
                {t.authShell.platformLabel}
              </span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <blockquote className="max-w-md space-y-4">
            <p className="text-2xl font-semibold leading-snug tracking-tight xl:text-3xl">
              &ldquo;{t.authShell.quote}&rdquo;
            </p>
            <footer className="text-sm text-white/70">{t.authShell.quoteFooter}</footer>
          </blockquote>

          <ul className="space-y-4">
            {highlights.map(({ id, icon: Icon, title, description }) => (
              <li key={id} className="flex gap-3 rounded-xl bg-white/8 p-4 ring-1 ring-white/10 backdrop-blur-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-creco-primary/20 text-creco-green-light">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-white/75">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/50">
          {format(t.authShell.footer, { year: String(new Date().getFullYear()) })}
        </p>
      </aside>

      <div className="relative flex min-h-svh flex-col justify-center bg-[var(--creco-surface)] px-4 py-10 sm:px-8 lg:min-h-0 lg:px-12 xl:px-16">
        <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-8 lg:right-12">
          <ThemeSwitcher />
        </div>
        <div className="mx-auto w-full max-w-md lg:max-w-lg">{children}</div>
      </div>
    </div>
  );
}
