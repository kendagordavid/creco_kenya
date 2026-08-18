import type { ChecklistSection } from "@/lib/content/checklist";

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "governance",
    title: "Utawala",
    items: [
      { id: "gov-1", label: "Sera ya bodi au masharti ya kazi yamepitishwa" },
      { id: "gov-2", label: "Sera ya migogoro ya maslahi ipo" },
      { id: "gov-3", label: "Mikutano ya bodi yanafanyika angalau kila robo mwaka" },
      { id: "gov-4", label: "Dakika zimesainiwa na kuhifadhiwa" },
      { id: "gov-5", label: "Maelezo ya viongozi yamesasishwa kwa Mamlaka ikiwa yamebadilika" },
      { id: "gov-6", label: "Uteuzi wa mamlaka umewekwa kwa maandishi" },
    ],
  },
  {
    id: "registration",
    title: "Nyaraka za usajili",
    items: [
      { id: "reg-1", label: "Cheti cha usajili kinapatikana" },
      { id: "reg-2", label: "Katiba inalingana na malengo yaliyosajiliwa" },
      { id: "reg-3", label: "Anwani ya ofisi iliyosajiliwa ni ya sasa" },
      { id: "reg-4", label: "Orodha ya wasaini imesasishwa benki" },
      { id: "reg-5", label: "Maombi ya mabadiliko ya jina au malengo yamekamilika (ikiwa yapo)" },
      { id: "reg-6", label: "Ingizo la usajili wa umma limekaguliwa kila mwaka" },
    ],
  },
  {
    id: "reporting",
    title: "Wajibu wa utoaji ripoti",
    items: [
      { id: "rep-1", label: "Ripoti ya mwaka imewasilishwa kwa wakati" },
      { id: "rep-2", label: "Taarifa za kifedha zimeandaliwa" },
      { id: "rep-3", label: "Ukaguzi au ukaguzi wa huru umekamilika (ikiwa unahitajika)" },
      { id: "rep-4", label: "Ripoti ya shughuli inaelezea matokeo ya faida ya umma" },
      { id: "rep-5", label: "Kodi na makato ya kisheria yamewasilishwa" },
      { id: "rep-6", label: "Ratiba za ripoti kwa wafadhili zimefikiwa" },
    ],
  },
  {
    id: "operations",
    title: "Uendeshaji na ulinzi",
    items: [
      { id: "ops-1", label: "Notisi ya ulinzi wa data na faragha imechapishwa" },
      { id: "ops-2", label: "Sera ya ulinzi kwa programu" },
      { id: "ops-3", label: "Sera ya ununuzi wa ruzuku na mikataba" },
      { id: "ops-4", label: "Mfumo wa kuripoti uovu au malalamiko" },
      { id: "ops-5", label: "Bima imekaguliwa kila mwaka" },
      { id: "ops-6", label: "Daftari la mali linadumishwa" },
    ],
  },
];

export const CHECKLIST_STORAGE_KEY = "creco-checklist-progress";
