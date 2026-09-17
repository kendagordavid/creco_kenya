"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export type HeroQuickLink = {
  label: string;
  href: string;
};

export type HeroQuickAccessCopy = {
  searchPlaceholder: string;
  searchLabel: string;
  browseLabel: string;
  links: readonly HeroQuickLink[];
};

type Props = {
  copy: HeroQuickAccessCopy;
};

export function HeroQuickAccess({ copy }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <div className="mt-5 rounded-[1.25rem] bg-[#ececec] px-4 py-5 sm:px-6 sm:py-6">
      <form onSubmit={onSubmit} role="search" className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="hero-search" className="sr-only">
          {copy.searchLabel}
        </label>
        <input
          id="hero-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          autoComplete="off"
          className="h-12 flex-1 rounded-xl border border-transparent bg-white px-4 text-sm text-creco-black shadow-sm outline-none ring-0 placeholder:text-creco-muted focus:border-creco-primary focus:ring-2 focus:ring-creco-primary/20"
        />
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-creco-orange px-5 text-creco-black shadow-sm transition hover:bg-creco-orange-light sm:w-14"
          aria-label={copy.searchLabel}
        >
          <Search className="size-5" aria-hidden />
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="shrink-0 text-sm font-medium text-creco-muted">{copy.browseLabel}</span>
        <div className="flex flex-wrap gap-2">
          {copy.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-full bg-creco-orange px-4 py-2 text-xs font-bold uppercase tracking-wide text-creco-black no-underline transition hover:bg-creco-orange-light"
            >
              {link.label}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
