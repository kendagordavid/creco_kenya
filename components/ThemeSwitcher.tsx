"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="size-9 rounded-lg bg-muted/50" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t.theme.switchToLight : t.theme.switchToDark}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg border border-creco-border bg-creco-surface text-creco-black-soft transition",
        "hover:bg-creco-green-muted hover:text-creco-primary dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-muted",
      )}
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
