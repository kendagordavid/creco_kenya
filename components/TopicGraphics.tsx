import { ParallaxGraphic } from "@/components/ParallaxGraphic";
import { TOPIC_GRAPHICS } from "@/lib/content/graphics";

export function TopicGraphics({ slug }: { slug: string }) {
  const graphics = TOPIC_GRAPHICS[slug];
  if (!graphics?.length) return null;

  return (
    <div className="mt-10 space-y-8">
      {graphics.map((graphic) => (
        <ParallaxGraphic key={graphic.src} src={graphic.src} alt={graphic.alt} speed={0.36} />
      ))}
    </div>
  );
}
