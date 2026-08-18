import type { AssessmentQuestion } from "@/lib/content/assessment";

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1",
    domain: "Usajili",
    prompt: "Cheti chetu cha usajili na katiba ni za sasa na zinapatikana kwa bodi.",
    options: [
      { value: 0, label: "Bado" },
      { value: 1, label: "Kwa sehemu" },
      { value: 2, label: "Ndiyo" },
    ],
  },
  {
    id: "q2",
    domain: "Usajili",
    prompt: "Tunamjulisha Mamlaka kuhusu mabadiliko makubwa ndani ya muda unaohitajika.",
    options: [
      { value: 0, label: "Bado" },
      { value: 1, label: "Kwa sehemu" },
      { value: 2, label: "Ndiyo" },
    ],
  },
  {
    id: "q3",
    domain: "Utawala",
    prompt: "Bodi inakutana mara kwa mara na inadumisha dakika zilizosainiwa.",
    options: [
      { value: 0, label: "Bado" },
      { value: 1, label: "Kwa sehemu" },
      { value: 2, label: "Ndiyo" },
    ],
  },
  {
    id: "q4",
    domain: "Utawala",
    prompt: "Tumepitisha sera za migogoro ya maslahi na uangalizi wa kifedha.",
    options: [
      { value: 0, label: "Bado" },
      { value: 1, label: "Kwa sehemu" },
      { value: 2, label: "Ndiyo" },
    ],
  },
  {
    id: "q5",
    domain: "Utoaji ripoti",
    prompt: "Ripoti za mwaka na taarifa za kifedha zinaandaliwa kwa ratiba.",
    options: [
      { value: 0, label: "Bado" },
      { value: 1, label: "Kwa sehemu" },
      { value: 2, label: "Ndiyo" },
    ],
  },
  {
    id: "q6",
    domain: "Utoaji ripoti",
    prompt: "Ripoti za programu zinaonyesha faida ya umma inayolingana na malengo yetu.",
    options: [
      { value: 0, label: "Bado" },
      { value: 1, label: "Kwa sehemu" },
      { value: 2, label: "Ndiyo" },
    ],
  },
  {
    id: "q7",
    domain: "Uendeshaji",
    prompt: "Wafanyakazi na wajitoleaji wanaelewa matarajio ya ulinzi wa data na ulinzi wa wanufaika.",
    options: [
      { value: 0, label: "Bado" },
      { value: 1, label: "Kwa sehemu" },
      { value: 2, label: "Ndiyo" },
    ],
  },
  {
    id: "q8",
    domain: "Uendeshaji",
    prompt: "Tunadumisha udhibiti wa kimsingi wa kifedha (wasaini wawili, upatanisho).",
    options: [
      { value: 0, label: "Bado" },
      { value: 1, label: "Kwa sehemu" },
      { value: 2, label: "Ndiyo" },
    ],
  },
];

export function scoreAssessment(answers: Record<string, number>) {
  const max = ASSESSMENT_QUESTIONS.length * 2;
  const total = ASSESSMENT_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const percent = Math.round((total / max) * 100);

  let band: "developing" | "progressing" | "strong";
  let summary: string;

  if (percent < 45) {
    band = "developing";
    summary =
      "Maeneo kadhaa ya msingi ya utii yanahitaji umakini. Weka kipaumbele nyaraka za usajili, utawala wa bodi, na utoaji ripoti wa kila mwaka.";
  } else if (percent < 75) {
    band = "progressing";
    summary =
      "Shirika lako lina mazoea mazuri lakini kuna mapengo ya kuziba. Zingatia uwasilishaji wa ripoti kwa wakati na sera zilizoandikwa.";
  } else {
    band = "strong";
    summary =
      "Ulinganifu imara na maeneo ya utii wa Sheria ya PBO. Dumisha rekodi na panga ukaguzi wa mara kwa mara wa bodi.";
  }

  const byDomain = ASSESSMENT_QUESTIONS.reduce<Record<string, number>>((acc, q) => {
    acc[q.domain] = (acc[q.domain] ?? 0) + (answers[q.id] ?? 0);
    return acc;
  }, {});

  return { total, max, percent, band, summary, byDomain };
}

export const ASSESSMENT_STORAGE_KEY = "creco-assessment-answers";
