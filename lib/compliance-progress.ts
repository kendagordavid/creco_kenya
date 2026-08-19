import { ASSESSMENT_QUESTIONS, scoreAssessment } from "@/lib/content/assessment";
import { CHECKLIST_SECTIONS } from "@/lib/content/checklist";

export const CHECKLIST_DATA_KEY = "creco-checklist-progress";
export const ASSESSMENT_DATA_KEY = "creco-assessment-answers";

export type SectionProgress = {
  id: string;
  title: string;
  completed: number;
  total: number;
  percent: number;
};

export type ChecklistProgress = {
  completed: number;
  total: number;
  percent: number;
  sections: SectionProgress[];
  started: boolean;
};

export type AssessmentProgress = {
  percent: number;
  band: string;
  summary: string;
  answered: number;
  total: number;
  byDomain: Record<string, number>;
  started: boolean;
} | null;

export function computeChecklistProgress(
  checked: Record<string, boolean> | null | undefined,
): ChecklistProgress {
  const total = CHECKLIST_SECTIONS.reduce((sum, section) => sum + section.items.length, 0);
  const completed = checked
    ? CHECKLIST_SECTIONS.reduce(
        (sum, section) => sum + section.items.filter((item) => checked[item.id]).length,
        0,
      )
    : 0;

  const sections: SectionProgress[] = CHECKLIST_SECTIONS.map((section) => {
    const sectionTotal = section.items.length;
    const sectionCompleted = section.items.filter((item) => checked?.[item.id]).length;
    return {
      id: section.id,
      title: section.title,
      completed: sectionCompleted,
      total: sectionTotal,
      percent: sectionTotal ? Math.round((sectionCompleted / sectionTotal) * 100) : 0,
    };
  });

  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    sections,
    started: completed > 0,
  };
}

export function computeAssessmentProgress(
  answers: Record<string, number> | null | undefined,
): AssessmentProgress {
  if (!answers || Object.keys(answers).length === 0) return null;

  const answered = ASSESSMENT_QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  if (answered === 0) return null;

  const result = scoreAssessment(answers);
  return {
    percent: result.percent,
    band: result.band,
    summary: result.summary,
    answered,
    total: ASSESSMENT_QUESTIONS.length,
    byDomain: result.byDomain,
    started: true,
  };
}

export type ProgressTier = "none" | "at_risk" | "emerging" | "progressing" | "strong";

export function checklistTier(percent: number, started: boolean): ProgressTier {
  if (!started) return "none";
  if (percent < 25) return "at_risk";
  if (percent < 50) return "emerging";
  if (percent < 75) return "progressing";
  return "strong";
}

export function tierStyles(tier: ProgressTier) {
  switch (tier) {
    case "at_risk":
      return {
        bar: "bg-red-500",
        ring: "stroke-red-500",
        badge: "bg-red-50 text-red-800 ring-red-200",
        label: "At risk",
      };
    case "emerging":
      return {
        bar: "bg-amber-500",
        ring: "stroke-amber-500",
        badge: "bg-amber-50 text-amber-900 ring-amber-200",
        label: "Emerging",
      };
    case "progressing":
      return {
        bar: "bg-sky-500",
        ring: "stroke-sky-600",
        badge: "bg-sky-50 text-sky-900 ring-sky-200",
        label: "Progressing",
      };
    case "strong":
      return {
        bar: "bg-creco-primary",
        ring: "stroke-[var(--creco-primary)]",
        badge: "bg-creco-green-muted text-creco-primary ring-creco-primary/20",
        label: "Strong",
      };
    default:
      return {
        bar: "bg-muted-foreground/30",
        ring: "stroke-muted-foreground/40",
        badge: "bg-muted text-muted-foreground ring-border",
        label: "Not started",
      };
  }
}

export function assessmentBandStyles(band: string) {
  switch (band) {
    case "strong":
      return "bg-creco-green-muted text-creco-primary ring-creco-primary/25";
    case "progressing":
      return "bg-sky-50 text-sky-900 ring-sky-200";
    case "developing":
      return "bg-amber-50 text-amber-900 ring-amber-200";
    default:
      return "bg-muted text-muted-foreground ring-border";
  }
}
