"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useTranslations } from "@/lib/i18n/client";

export function SearchForm({ defaultQuery = "", compact = false }: { defaultQuery?: string; compact?: boolean }) {
  const router = useRouter();
  const t = useTranslations();
  const [query, setQuery] = useState(defaultQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={compact ? "flex flex-col gap-2 sm:flex-row" : "flex max-w-xl flex-col gap-2 sm:flex-row"}
    >
      <label htmlFor="global-search" className="sr-only">
        {t.search.label}
      </label>
      <input
        id="global-search"
        name="q"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.search.placeholder}
        autoComplete="off"
        className={`creco-input flex-1 ${compact ? "text-sm" : ""}`}
      />
      <button
        type="submit"
        className={`creco-btn creco-btn-primary w-full sm:w-auto ${compact ? "text-sm" : ""}`}
      >
        {t.search.submit}
      </button>
    </form>
  );
}
