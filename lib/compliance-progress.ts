import { ASSESSMENT_QUESTIONS, scoreAssessment } from "@/lib/content/assessment";
import {
  CHECKLIST_SECTIONS,
  normalizeChecklistState,
  scoredQuestions,
  sectionsForStatus,
  visibleQuestions,
  type OrgStatus,
} from "@/lib/content/checklist";

export const CHECKLIST_DATA_KEY = "creco-checklist-progress";
export const ASSESSMENT_DATA_KEY = "creco-assessment-answers";

export type SectionProgress = {
  id: string;
  title: string;
  completed: number;
  total: number;
  percent: number;
};

export type ChecklistGap = {
  id: string;
  label: string;
  sectionId: string;
};

/**
 * Compliance score for the statutory checklist: "Yes" answers out of the
 * requirement questions that apply to the organisation's status.
 */
export type ChecklistProgress = {
  status?: OrgStatus;
  /** Requirement questions answered "Yes". */
  completed: number;
  /** Requirement questions that apply, including opened follow-ups. */
  total: number;
  percent: number;
  /** Visible questions answered, including triggers. */
  answered: number;
  questions: number;
  sections: SectionProgress[];
  gaps: ChecklistGap[];
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

export function computeChecklistProgress(saved: unknown): ChecklistProgress {
  const { status, answers } = normalizeChecklistState(saved);
  const started = Boolean(status) || Object.keys(answers).length > 0;
  if (!status) {
    return { completed: 0, total: 0, percent: 0, answered: 0, questions: 0, sections: [], gaps: [], started };
  }

  let answered = 0;
  let questions = 0;
  const gaps: ChecklistGap[] = [];
  const sections: SectionProgress[] = sectionsForStatus(CHECKLIST_SECTIONS, status).map((section) => {
    const visible = visibleQuestions(section, answers);
    questions += visible.length;
    answered += visible.filter((question) => answers[question.id]).length;

    const scored = scoredQuestions(section, answers);
    const sectionCompleted = scored.filter((entry) => entry.answer === "yes").length;
    for (const entry of scored) {
      if (entry.answer === "no") {
        gaps.push({ id: entry.question.id, label: entry.question.label, sectionId: section.id });
      }
    }
    return {
      id: section.id,
      title: section.title,
      completed: sectionCompleted,
      total: scored.length,
      // A section with no requirements open (e.g. no material changes) is complete once answered.
      percent: scored.length
        ? Math.round((sectionCompleted / scored.length) * 100)
        : visible.every((question) => answers[question.id])
          ? 100
          : 0,
    };
  });

  const completed = sections.reduce((sum, section) => sum + section.completed, 0);
  const total = sections.reduce((sum, section) => sum + section.total, 0);

  return {
    status,
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    answered,
    questions,
    sections,
    gaps,
    started,
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
