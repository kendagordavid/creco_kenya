"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchForm({ defaultQuery = "", compact = false }: { defaultQuery?: string; compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "flex gap-2" : "max-w-xl"}>
      <label htmlFor="global-search" className="sr-only">
        Search the platform
      </label>
      <input
        id="global-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search topics, FAQs, templates…"
        className={`creco-input flex-1 ${compact ? "text-sm" : ""}`}
      />
      <button type="submit" className={`creco-btn creco-btn-primary ${compact ? "text-sm" : ""}`}>
        Search
      </button>
    </form>
  );
}
