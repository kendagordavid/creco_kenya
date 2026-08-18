import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { MEDIA_ITEMS } from "@/lib/content/knowledge";

export const metadata = {
  title: "Media gallery",
};

export default function MediaGalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Knowledge hub"
        title="Media gallery"
        lead="Videos, infographics, and guides introducing the PBO Act and compliance basics."
        variant="light"
      />
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MEDIA_ITEMS.map((item) => (
              <article key={item.id} className="creco-card p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-creco-accent">
                  {item.type}
                  {item.duration ? ` · ${item.duration}` : ""}
                </span>
                <h2 className="mt-2 text-lg font-bold text-creco-black">{item.title}</h2>
                <p className="mt-2 text-sm text-creco-muted">{item.summary}</p>
                <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-creco-surface text-sm text-creco-muted">
                  Media preview — connect CDN in production
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
