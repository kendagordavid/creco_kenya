import { TOPIC_GRAPHICS } from "@/lib/content/graphics";

/**
 * Infographics shown whole (no parallax crop) so their text stays readable,
 * each linking to the full-size image for zooming on a phone.
 */
export function TopicGraphics({ slug, openLabel }: { slug: string; openLabel: string }) {
  const graphics = TOPIC_GRAPHICS[slug];
  if (!graphics?.length) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {graphics.map((graphic, index) => (
        <figure key={graphic.src} className={graphics.length === 1 ? "sm:col-span-2" : undefined}>
          <a href={graphic.src} target="_blank" rel="noopener noreferrer" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static infographic */}
            <img
              src={graphic.src}
              alt={graphic.alt}
              loading={index === 0 ? "eager" : "lazy"}
              className="block h-auto w-full rounded-xl border border-creco-border bg-white"
            />
          </a>
          <figcaption className="mt-2 flex items-center justify-between gap-2 text-xs text-creco-muted">
            <span className="font-semibold">{graphic.title}</span>
            <a href={graphic.src} target="_blank" rel="noopener noreferrer" className="shrink-0 text-creco-primary no-underline">
              {openLabel} ↗
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
