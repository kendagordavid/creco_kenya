import type { FaqItem } from "@/lib/content/faqs";

export const FAQ_CATEGORIES = [
  { slug: "registration", title: "Usajili", count: 6 },
  { slug: "governance", title: "Utawala", count: 4 },
  { slug: "reporting", title: "Utoaji ripoti", count: 4 },
  { slug: "penalties", title: "Adabu na utii wa sheria", count: 3 },
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    slug: "what-is-a-pbo",
    category: "registration",
    question: "Shirika la Faida ya Umma (PBO) ni nini?",
    answer:
      "PBO ni kikundi cha hiari cha wanachama au kisicho na wanachama cha watu binafsi au mashirika kinachofanya kazi kwa faida ya umma. Chini ya Sheria ya PBO, 2013, mashirika yanayostahili husajiliwa na Mamlaka ya Udhibiti wa PBO ili kupata utu wa kisheria na kufanya kazi chini ya mfumo wa udhibiti wa pamoja.",
  },
  {
    slug: "who-can-register",
    category: "registration",
    question: "Nani anaweza kusajiliwa kama PBO?",
    answer:
      "Vyombo visivyolipa faida vilivyoanzishwa kwa faida ya umma — pamoja na NGO, mashirika ya kijamii, misingi, na amana — yanaweza kuomba ikiwa yanakidhi vigezo vya ustahili katika Sheria na kuwasilisha nyaraka zinazohitajika.",
  },
  {
    slug: "registration-documents",
    category: "registration",
    question: "Ni nyaraka gani zinahitajika kwa usajili?",
    answer:
      "Mahitaji ya kawaida ni pamoja na katiba au nyaraka za utawala, fomu za maombi ya usajili, maelezo ya viongozi, uthibitisho wa anwani, na viambatisho vyovyote vya kipekee kwa sekta. Angalia mada ya mahitaji ya usajili kwa orodha kamili.",
  },
  {
    slug: "registration-timeline",
    category: "registration",
    question: "Usajili unachukua muda gani?",
    answer:
      "Sheria inaweka muda wa maamuzi ya Mamlaka kuhusu maombi. Ucheleweshaji unaweza kutokea pale nyaraka hazijakamilika au taarifa za ziada zimeombwa. Fuatilia uzoefu wako kupitia moduli ya ufuatiliaji ikiwa unakumbana na vikwazo.",
  },
  {
    slug: "registration-fees",
    category: "registration",
    question: "Je, kuna ada za usajili?",
    answer:
      "Ratiba za ada zinachapishwa na Mamlaka ya Udhibiti wa PBO. Mashirika yanapaswa kuthibitisha ada za sasa kutoka kwa mawasiliano rasmi ya Mamlaka kabla ya kuwasilisha maombi.",
  },
  {
    slug: "change-of-particulars",
    category: "registration",
    question: "Tunawezaje kusasisha maelezo yaliyosajiliwa?",
    answer:
      "Mabadiliko makubwa katika utawala, jina, au malengo kwa kawaida yanahitaji taarifa au idhini ya Mamlaka. Weka dakika za bodi na wasilisha masasisho ndani ya muda uliowekwa.",
  },
  {
    slug: "board-responsibilities",
    category: "governance",
    question: "Ni majukumu gani makuu ya bodi?",
    answer:
      "Bodi husimamia mkakati, uangalizi wa kifedha, utii wa Sheria, na uwajibikaji kwa wanachama na wanufaika. Utawala bora ni pamoja na sera zilizoandikwa, mikutano ya mara kwa mara, na usimamizi wa migogoro ya maslahi.",
  },
  {
    slug: "constitution-requirements",
    category: "governance",
    question: "Katiba yetu inapaswa kujumuisha nini?",
    answer:
      "Katiba inapaswa kufafanua malengo, uanachama, miundo ya utawala, sheria za mikutano, udhibiti wa kifedha, na taratibu za marekebisho — zikiendana na mahitaji ya Sheria ya PBO na dhamira ya shirika lako.",
  },
  {
    slug: "conflict-of-interest",
    category: "governance",
    question: "Migogoro ya maslahi inapaswa kushughulikiwa vipi?",
    answer:
      "Pitia sera ya maandishi ya migogoro ya maslahi. Wanachama wa bodi wanapaswa kutangaza maslahi na kujiondoa kwenye maamuzi pale wana maslahi ya kibinafsi.",
  },
  {
    slug: "annual-general-meeting",
    category: "governance",
    question: "Je, ni lazima tufanye MKK (Mkutano Mkuu wa Mwaka)?",
    answer:
      "Mashirika yanayojumuisha wanachama kwa kawaida hufanya MKK kama ilivyoainishwa katika katiba yao. Rekodi mahudhurio, maazimio, na ripoti hata pale Sheria inaruhusu miundo rahisi kwa PBO zisizo na uanachama.",
  },
  {
    slug: "annual-reporting",
    category: "reporting",
    question: "Utoaji wa ripoti za kila mwaka unahitajika vipi?",
    answer:
      "PBO zilizosajiliwa lazima zwasilishe ripoti za kila mwaka kama ilivyoainishwa na Mamlaka, ikiwa ni pamoja na taarifa za kifedha na muhtasari wa shughuli. Kukosa muda kunaweza kuathiri hali ya utii.",
  },
  {
    slug: "financial-records",
    category: "reporting",
    question: "Tunapaswa kuweka rekodi za kifedha vipi?",
    answer:
      "Weka vitabu sahihi vya akaunti, upatanisho wa benki, na voucha za usaidizi. Mashirika mengi hutumia chati rahisi ya akaunti na ukaguzi wa ndani wa mara kwa mara kabla ya ukaguzi au idhini ya bodi.",
  },
  {
    slug: "audit-requirements",
    category: "reporting",
    question: "Ukaguzi unahitajika lini?",
    answer:
      "Vizingiti vya ukaguzi vinategemea mapato na kanuni za Mamlaka. Hata wakati si lazima, ukaguzi wa huru wa mara kwa mara huimarisha uwajibikaji kwa wafadhili na wanachama.",
  },
  {
    slug: "public-benefit-reporting",
    category: "reporting",
    question: "Tunawezaje kuonyesha faida ya umma?",
    answer:
      "Andika programu, wanufaika, na matokeo katika ripoti za kila mwaka. Unganisha shughuli na malengo yako yaliyosajiliwa na weka ushahidi wa athari kwa jamii.",
  },
  {
    slug: "non-compliance-consequences",
    category: "penalties",
    question: "Nini hutokea tukishindwa kutii?",
    answer:
      "Kutokutii masharti ya usajili, utoaji ripoti, au mahitaji ya utawala kunaweza kusababisha adabu, kusimamishwa, au kufutwa kwa usajili kulingana na ukali na hatua za kurekebisha zilizochukuliwa.",
  },
  {
    slug: "late-filing",
    category: "penalties",
    question: "Je, kuwasilisha kwa kuchelewa kunaweza kurekebishwa?",
    answer:
      "Mashirika yanapaswa kuwasiliana na Mamlaka haraka, kuwasilisha ripoti zilizochelewa, na kuandika hatua za kurekebisha. Utii wa mapema hupunguza hatari ya utekelezaji wa sheria.",
  },
  {
    slug: "operating-without-registration",
    category: "penalties",
    question: "Je, tunaweza kufanya kazi kabla ya usajili kukamilika?",
    answer:
      "Mashirika hayapaswi kujitambulisha kama PBO zilizosajiliwa hadi Mamlaka ithibitishe usajili. Shughuli za muda wa kati zinaweza kuendelea chini ya fomu za kisheria za awali pale zinatumika.",
  },
];

export function getFaqsByCategory(category: string) {
  return FAQ_ITEMS.filter((item) => item.category === category);
}

export function getFaqBySlug(slug: string) {
  return FAQ_ITEMS.find((item) => item.slug === slug);
}
