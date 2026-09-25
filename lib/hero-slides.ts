/** Homepage hero carousel — NGO graphics + community photos, matched to slide copy. */
export type HeroSlideAsset = {
  id: string;
  ctaHref: string;
  imageSrc: string;
  imagePosition: string;
  /** Infographics use contain + light backdrop so text stays readable. */
  isGraphic: boolean;
};

export const HERO_SLIDE_ASSETS: readonly HeroSlideAsset[] = [
  {
    id: "understand-the-law",
    ctaHref: "/knowledge/topics/what-is-a-pbo",
    imageSrc: "/images/graphics/defining-a-pbo.jpg",
    imagePosition: "center top",
    isGraphic: true,
  },
  {
    id: "register-correctly",
    ctaHref: "/knowledge/topics/registration-process-and-timeline",
    imageSrc: "/images/graphics/how-to-register.png",
    imagePosition: "center top",
    isGraphic: true,
  },
  {
    id: "stay-compliant",
    ctaHref: "/compliance",
    imageSrc: "/images/hero/stay-compliant.jpg",
    imagePosition: "center",
    isGraphic: false,
  },
  {
    id: "ask-a-question",
    ctaHref: "/guidance?ask=1",
    imageSrc: "/images/hero/ask-a-question.jpg",
    imagePosition: "center",
    isGraphic: false,
  },
  {
    id: "civic-space",
    ctaHref: "/monitoring",
    imageSrc: "/images/hero/civic-space.jpg",
    imagePosition: "center",
    isGraphic: false,
  },
] as const;

export const HERO_SIDE_CARD_IMAGES = [
  "/images/hero/stay-compliant.jpg",
  "/images/hero/register-correctly.jpg",
] as const;
