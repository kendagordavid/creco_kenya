import { TOPIC_GRAPHICS } from "@/lib/content/graphics";

/**
 * Infographics shown whole (no parallax crop) so their text stays readable,
 * each linking to the full-size image for zooming on a phone.
 */
export function TopicGraphics({ slug, openLabel }: { slug: string; openLabel: string }) {
  const graphics = TOPIC_GRAPHICS[slug];
  if (!graphics?.length) return null;

  return (
    <div className="grid items-start gap-6 sm:grid-cols-2">
      {graphics.map((graphic, index) => (
        <figure key={graphic.src} className={graphics.length === 1 ? "sm:col-span-2" : undefined}>
          {/* The title sits above the graphic so readers know what it covers before they look. */}
          <figcaption className="mb-2 text-base font-bold leading-snug text-creco-black dark:text-foreground">
            {graphic.title}
          </figcaption>
          <a href={graphic.src} target="_blank" rel="noopener noreferrer" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static infographic */}
            <img
              src={graphic.src}
              alt={graphic.alt}
              loading={index === 0 ? "eager" : "lazy"}
              className="block h-auto w-full rounded-xl border border-creco-border bg-white"
            />
          </a>
          <a href={graphic.src} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-creco-primary no-underline">
            {openLabel} ↗
          </a>
        </figure>
      ))}
    </div>
  );
}
