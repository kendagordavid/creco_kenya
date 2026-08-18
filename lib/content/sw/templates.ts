import type { TemplateItem } from "@/lib/content/templates";

export const TEMPLATE_ITEMS: TemplateItem[] = [
  {
    slug: "board-resolution-registration",
    title: "Azimio la bodi — maombi ya usajili",
    summary: "Idhinisha uwasilishaji wa maombi ya usajili wa PBO na wasaini walioorodheshwa.",
    category: "Utawala",
    format: "Muundo wa DOCX",
    body: `AZIMIO LA BODI LA [JINA LA SHIRIKA]
Tarehe: [TAREHE]

IMEAZIMIWA KWAMBA:
1. Shirika litomba usajili kama Shirika la Faida ya Umma chini ya Sheria ya PBO, 2013.
2. [JINA, CHEO] anaidhinishwa kusaini na kuwasilisha fomu zote za usajili na nyaraka za usaidizi.
3. Katiba iliyoambatishwa kama Kiambatisho A inapokelewa kama nyaraka ya utawala kwa madhumuni ya usajili.

Imethibitishwa na:
Mwenyekiti: ___________________  Tarehe: _______
Katibu: ____________________  Tarehe: _______`,
  },
  {
    slug: "conflict-of-interest-policy",
    title: "Sera ya migogoro ya maslahi",
    summary: "Kiolezo cha sera kwa matangazo na kujiondoa kwa bodi na wafanyakazi.",
    category: "Utawala",
    format: "Muundo wa sera",
    body: `SERA YA MIGOGORO YA MASLAAHI — [JINA LA SHIRIKA]

1. Madhumuni
Kulinda uadilifu wa maamuzi na imani ya umma.

2. Upeo
Inatumika kwa wanachama wa bodi, wafanyakazi, na wajitoleaji wenye mamlaka ya kufanya maamuzi.

3. Matangazo
Wanachama watatangaza maslahi ya kibinafsi, kifedha, au ya familia yanayohusiana na mambo ya ajenda.

4. Kujiondoa
Wanachama walioathirika hawataushiriki majadiliano wala kupiga kura kuhusu masuala yenye migogoro ya maslahi.

5. Uhifadhi wa rekodi
Matangazo yataandikwa katika dakika.

Imepitishwa: [TAREHE]  Ukaguzi unaotarajiwa: [TAREHE]`,
  },
  {
    slug: "annual-return-checklist",
    title: "Orodha ya ukaguzi wa maandalizi ya ripoti ya mwaka",
    summary: "Orodha ya ndani kabla ya kuwasilisha ripoti za mwaka kwa Mamlaka.",
    category: "Utoaji ripoti",
    format: "Orodha ya ukaguzi",
    body: `MAANDALIZI YA RIPOTI YA MWAKA — [MWAKA]

□ Taarifa za kifedha zimesainiwa na bodi
□ Ripoti ya shughuli inaelezea programu na wanufaika
□ Orodha ya viongozi imesasishwa
□ Nakala ya cheti cha usajili imeambatishwa
□ Ripoti ya mkaguzi (ikiwa inatumika)
□ Ada ya uwasilishaji imethibitishwa
□ Nakala ya uwasilishaji imehifadhiwa ndani ya shirika`,
  },
  {
    slug: "membership-register",
    title: "Kiolezo cha daftari la wanachama",
    summary: "Daftari rahisi kwa PBO zinazojumuisha wanachama.",
    category: "Utawala",
    format: "Daftari",
    body: `DAFTARI LA WANACHAMA — [JINA LA SHIRIKA]

| Na. | Jina kamili | Kitambulisho/Mawasiliano | Tarehe ya kujiunga | Hali |
|-----|-------------|----------------------------|--------------------|------|
| 1   |             |                            |                    | Hai |

Inadumishwa na: [JINA LA KATIBU]
Ilisasishwa mwisho: [TAREHE]`,
  },
  {
    slug: "programme-report",
    title: "Ripoti ya shughuli za programu",
    summary: "Kiolezo cha maelezo na viashiria kwa utoaji ripoti wa kila mwaka.",
    category: "Utoaji ripoti",
    format: "Muundo wa ripoti",
    body: `RIPOTI YA SHUGHULI ZA PROGRAMU — [KIPINDI]

1. Muhtasari wa shughuli za faida ya umma
2. Wanufaika waliowasiliwa (kwa makundi inapowezekana)
3. Ushirikiano na eneo la kijiografia
4. Changamoto na hatua za kuzishughulikia
5. Uhusiano na malengo yaliyosajiliwa chini ya Sheria ya PBO
6. Muhtasari wa kifedha (kiwango cha juu)

Iliandaliwa na: _____________  Imeidhinishwa na bodi: _____________`,
  },
];

export function getTemplateBySlug(slug: string) {
  return TEMPLATE_ITEMS.find((t) => t.slug === slug);
}
