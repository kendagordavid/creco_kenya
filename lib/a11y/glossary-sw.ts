import type { GlossaryEntry } from "@/lib/a11y/glossary";

/** Kiswahili definitions for terms highlighted in topic pages. */
export const GLOSSARY_SW: Record<string, GlossaryEntry> = {
  pbo: {
    term: "PBO",
    definition:
      "Shirika la Manufaa ya Umma — shirika lisilo la faida lililosajiliwa chini ya Sheria ya Mashirika ya Manufaa ya Umma, 2013 kwa madhumuni ya jamii, elimu, dini au manufaa ya umma mengine.",
  },
  "public benefit organization": {
    term: "Shirika la Manufaa ya Umma",
    definition:
      "Shirika lililoanzishwa kwa madhumuni ya manufaa ya umma na lililosajiliwa chini ya Sheria ya PBO, 2013. PBO lazima zifanye kazi kwa uwazi na kuzingatia mahitaji ya uzingatiaji.",
  },
  "regulatory authority": {
    term: "Mamlaka ya Udhibiti",
    definition:
      "PBORA — chombo cha serikali kinachosimamia usajili, uzingatiaji na utekelezaji chini ya Sheria ya PBO na Kanuni zake.",
  },
  "public registry": {
    term: "Sajili ya Umma",
    definition:
      "Daftari rasmi la PBO zilizosajiliwa. Taarifa za msingi za shirika zinawekwa hapa kwa ufikiaji wa umma.",
  },
  "pbo act": {
    term: "Sheria ya PBO",
    definition:
      "Sheria ya Mashirika ya Manufaa ya Umma, 2013 — sheria kuu ya Kenya inayodhibiti usajili na uendeshaji wa PBO.",
  },
  devolution: {
    term: "Ugatuzi",
    definition:
      "Uhamishaji wa madaraka kutoka serikali kuu kwenda serikali za kaunti chini ya Sura ya Kumi na Moja ya Katiba ya Kenya, 2010.",
  },
  "bill of rights": {
    term: "Hati ya Haki",
    definition:
      "Sura ya Nne ya Katiba ya Kenya, 2010 — haki na uhuru wa msingi wa kila mtu, ikiwa ni pamoja na haki za watu wenye ulemavu.",
  },
  compliance: {
    term: "Uzingatiaji",
    definition:
      "Kutimiza wajibu wa kisheria chini ya Sheria ya PBO na Kanuni, ikiwa ni pamoja na kuwasilisha ripoti na kuhifadhi rekodi.",
  },
  registration: {
    term: "Usajili",
    definition:
      "Mchakato wa kisheria wa kuingizwa kwenye Sajili ya Umma kama PBO inayotambuliwa chini ya Sheria ya PBO.",
  },
};

export const GLOSSARY_SW_TERMS_SORTED = Object.keys(GLOSSARY_SW).sort((a, b) => b.length - a.length);
