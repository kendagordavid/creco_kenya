import type { NewsCategory } from "@/lib/news";
import type { Dictionary } from "@/lib/i18n/messages/en";
import { cn } from "@/lib/utils";

type Props = {
  category: NewsCategory;
  labels: Dictionary["newsPage"]["categories"];
  className?: string;
};

export function NewsCategoryBadge({ category, labels, className }: Props) {
  return (
    <span className={cn("creco-news-kicker", className)}>
      {labels[category]}
    </span>
  );
}
