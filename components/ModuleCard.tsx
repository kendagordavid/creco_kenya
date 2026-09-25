import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
  accent?: "green" | "orange";
  imageSrc?: string;
  imageAlt?: string;
};

export function ModuleCard({
  title,
  description,
  href,
  accent = "green",
  imageSrc,
  imageAlt = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`creco-card group block overflow-hidden p-0 no-underline ${
        accent === "orange" ? "creco-card-accent" : "creco-card-green"
      }`}
    >
      {imageSrc && (
        <div className="relative h-40 w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      )}
      <div className="p-7">
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
      </div>
    </Link>
  );
}
