import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
  accent?: "green" | "orange";
};

export function ModuleCard({ title, description, href, accent = "green" }: Props) {
  return (
    <Link
      href={href}
      className={`creco-card group block p-7 no-underline ${
        accent === "orange" ? "creco-card-accent" : "creco-card-green"
      }`}
    >
      <h3 className="text-xl font-bold text-creco-black transition-colors group-hover:text-creco-primary">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-creco-muted">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-creco-primary">
        Open
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
