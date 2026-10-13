import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { CRECO_GRAPHICS } from "@/lib/content/graphics";
import { getServerTranslations } from "@/lib/i18n/server";

export const metadata = {
  title: "Media",
};

export default async function MediaGalleryPage() {
  const { t } = await getServerTranslations();
  const graphics = Object.values(CRECO_GRAPHICS);

  return (
    <>
      <PageHero
        eyebrow={t.knowledgeHub.eyebrow}
        title={t.knowledgeHub.filters.media}
        lead={t.knowledgeHub.lead}
        backgroundImage="/images/pages/knowledge-discussion.jpg"
        backgroundAlt={t.knowledgeHub.imageAlt}
      />
      <section className="creco-section">
        <div className="creco-container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {graphics.map((item) => (
              <article key={item.src} className="creco-card overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={640}
                  height={480}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="text-lg font-bold text-creco-black dark:text-foreground">{item.title}</h2>
                  <p className="mt-2 text-sm text-creco-muted">{item.alt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
