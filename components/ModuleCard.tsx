import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
  accent?: "green" | "orange";
  imageSrc?: string;
  imageAlt?: string;
  /** Width / height of a banner image, so the whole banner shows instead of a cropped strip. */
  imageAspect?: number;
};

export function ModuleCard({
  title,
  description,
  href,
  accent = "green",
  imageSrc,
  imageAlt = "",
  imageAspect,
}: Props) {
  return (
    <Link
      href={href}
      className={`creco-card group block overflow-hidden p-0 no-underline ${
        accent === "orange" ? "creco-card-accent" : "creco-card-green"
      }`}
    >
      {imageSrc && (
        <div
          className={imageAspect ? "relative w-full bg-[#f3f3f3]" : "relative h-40 w-full"}
          style={imageAspect ? { aspectRatio: imageAspect } : undefined}
        >
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
