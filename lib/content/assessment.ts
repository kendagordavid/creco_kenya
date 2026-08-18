export type AssessmentQuestion = {
  id: string;
  domain: string;
  prompt: string;
  options: { value: number; label: string }[];
};

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1",
    domain: "Registration",
    prompt: "Our registration certificate and constitution are current and accessible to the board.",
    options: [
      { value: 0, label: "Not yet" },
      { value: 1, label: "Partially" },
      { value: 2, label: "Yes" },
    ],
  },
  {
    id: "q2",
    domain: "Registration",
    prompt: "We notify the Authority of material changes within required timelines.",
    options: [
      { value: 0, label: "Not yet" },
      { value: 1, label: "Partially" },
      { value: 2, label: "Yes" },
    ],
  },
  {
    id: "q3",
    domain: "Governance",
    prompt: "The board meets regularly and maintains signed minutes.",
    options: [
      { value: 0, label: "Not yet" },
      { value: 1, label: "Partially" },
      { value: 2, label: "Yes" },
    ],
  },
  {
    id: "q4",
    domain: "Governance",
    prompt: "We have adopted policies for conflict of interest and financial oversight.",
    options: [
      { value: 0, label: "Not yet" },
      { value: 1, label: "Partially" },
      { value: 2, label: "Yes" },
    ],
  },
  {
    id: "q5",
    domain: "Reporting",
    prompt: "Annual returns and financial statements are prepared on schedule.",
    options: [
      { value: 0, label: "Not yet" },
      { value: 1, label: "Partially" },
      { value: 2, label: "Yes" },
    ],
  },
  {
    id: "q6",
    domain: "Reporting",
    prompt: "Programme reports demonstrate public benefit aligned with our objects.",
    options: [
      { value: 0, label: "Not yet" },
      { value: 1, label: "Partially" },
      { value: 2, label: "Yes" },
    ],
  },
  {
    id: "q7",
    domain: "Operations",
    prompt: "Staff and volunteers understand data protection and safeguarding expectations.",
    options: [
      { value: 0, label: "Not yet" },
      { value: 1, label: "Partially" },
      { value: 2, label: "Yes" },
    ],
  },
  {
    id: "q8",
    domain: "Operations",
    prompt: "We maintain basic financial controls (dual signatory, reconciliations).",
    options: [
      { value: 0, label: "Not yet" },
      { value: 1, label: "Partially" },
      { value: 2, label: "Yes" },
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
      "Several foundational compliance areas need attention. Prioritise registration documents, board governance, and annual reporting.";
  } else if (percent < 75) {
    band = "progressing";
    summary =
      "Your organisation has good practices in place with gaps to close. Focus on reporting timeliness and documented policies.";
  } else {
    band = "strong";
    summary =
      "Strong alignment with PBO Act compliance domains. Maintain records and schedule periodic board review.";
  }

  const byDomain = ASSESSMENT_QUESTIONS.reduce<Record<string, number>>((acc, q) => {
    acc[q.domain] = (acc[q.domain] ?? 0) + (answers[q.id] ?? 0);
    return acc;
  }, {});

  return { total, max, percent, band, summary, byDomain };
}

export const ASSESSMENT_STORAGE_KEY = "creco-assessment-answers";
