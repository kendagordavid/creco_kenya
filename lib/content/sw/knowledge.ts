import type { MediaItem, ToolkitItem } from "@/lib/content/knowledge";

export const TOOLKIT_ITEMS: ToolkitItem[] = [
  {
    slug: "registration-starter-pack",
    title: "Kifurushi cha kuanzia usajili wa PBO",
    summary: "Mwongozo wa hatua kwa hatua kwa waombaji wa mara ya kwanza wanaotayarisha nyaraka.",
    sections: [
      "Thibitisha ustahili na malengo",
      "Andika au rekebisha katiba",
      "Kusanya vitambulisho na CV za viongozi",
      "Andaa ushahidi wa ofisi iliyosajiliwa",
      "Jaza fomu za maombi ya Mamlaka",
      "Azimio la bodi linaloidhinisha maombi",
    ],
  },
  {
    slug: "governance-basics",
    title: "Misingi ya utawala kwa PBO ndogo",
    summary: "Kifurushi cha utawala rahisi kwa mashirika ya kijamii.",
    sections: [
      "Majukumu ya bodi na ratiba ya mikutano",
      "Misingi ya uangalizi wa kifedha",
      "Matangazo ya migogoro ya maslahi",
      "Ratiba ya uhifadhi wa nyaraka",
      "Kifurushi cha uanzishaji kwa wadhamini wapya",
    ],
  },
  {
    slug: "reporting-toolkit",
    title: "Kifurushi cha utoaji ripoti wa kila mwaka",
    summary: "Andaa ripoti za mwaka na maelezo ya faida ya umma.",
    sections: [
      "Ratiba inayolingana na muda wa Mamlaka",
      "Orodha ya ukaguzi wa taarifa za kifedha",
      "Karatasi ya viashiria vya programu",
      "Taratibu za idhini ya bodi",
      "Uthibitisho wa uwasilishaji na kumbukumbu",
    ],
  },
];

export function getToolkitBySlug(slug: string) {
  return TOOLKIT_ITEMS.find((t) => t.slug === slug);
}

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "media-1",
    title: "Utangulizi wa Sheria ya PBO, 2013",
    type: "video",
    duration: "dakika 8",
    summary: "Muhtasari wa sababu ya kuanzishwa kwa Sheria na nani inawashughulikia.",
  },
  {
    id: "media-2",
    title: "Mwongozo wa mchakato wa usajili",
    type: "video",
    duration: "dakika 12",
    summary: "Mwongozo wa kuona hatua za maombi na nyaraka za kawaida.",
  },
  {
    id: "media-3",
    title: "Majukumu ya Mamlaka ya Udhibiti wa PBO",
    type: "infographic",
    summary: "Mchoro wa ukurasa mmoja wa kazi za Mamlaka na usajili wa umma.",
  },
  {
    id: "media-4",
    title: "Kalenda ya utii wa sheria",
    type: "infographic",
    summary: "Utoaji ripoti wa kila mwaka na ratiba ya mikutano ya bodi kwa muhtasari.",
  },
  {
    id: "media-5",
    title: "Jua nyaraka zako za utawala",
    type: "guide",
    summary: "Maelezo kwa lugha rahisi kuhusu mambo muhimu ya katiba.",
  },
];
