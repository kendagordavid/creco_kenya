/**
 * PBO Statutory Compliance Self-Assessment Checklist.
 *
 * Source: CRECO Kenya – ICNL "PBO Statutory Compliance Self-Assessment Checklist",
 * based on the PBO Act, 2013, the PBO Regulations, 2026, and the approved legal summaries.
 *
 * Sections and questions are filtered by the organisation status chosen in Section A.
 * Questions with `kind: "trigger"` are not scored: answering "Yes" opens their follow-ups,
 * which are scored. Every other question is a requirement where "Yes" means compliant.
 */

export type OrgStatus = "national" | "ipbo" | "exempt" | "bestowed";

export type ChecklistAnswer = "yes" | "no";

export type ChecklistQuestion = {
  id: string;
  label: string;
  /** Examples or clarification shown under the question. */
  hint?: string;
  /** Sub-heading the question sits under, e.g. "Governance". */
  group?: string;
  /** Narrows the section's audience for this question. */
  appliesTo?: OrgStatus[];
  kind?: "requirement" | "trigger";
  /** Shown only when this question is answered "Yes". */
  followUps?: ChecklistQuestion[];
};

export type ChecklistSection = {
  id: string;
  title: string;
  description?: string;
  /** Organisation statuses the section applies to; omitted means all. */
  appliesTo?: OrgStatus[];
  questions: ChecklistQuestion[];
};

export type ChecklistState = {
  version: 2;
  status?: OrgStatus;
  answers: Record<string, ChecklistAnswer>;
};

export type ChecklistIntro = {
  title: string;
  legalBasis: string;
  purpose: string[];
  guidance: string;
  statusQuestion: string;
  statusOptions: { value: OrgStatus; label: string }[];
};

const REGISTERED: OrgStatus[] = ["national", "ipbo"];
const EXEMPT_OR_BESTOWED: OrgStatus[] = ["exempt", "bestowed"];

export const CHECKLIST_INTRO: ChecklistIntro = {
  title: "PBO statutory compliance self-assessment checklist",
  legalBasis:
    "Legal basis: Public Benefit Organizations Act, 2013; Public Benefit Organizations Regulations, 2026; and the approved PBO legal summaries.",
  purpose: [
    "This self-assessment helps organisations evaluate their compliance with applicable requirements under the Public Benefit Organizations legal framework.",
    "It is not a substitute for legal advice, an inspection, or a determination by the Public Benefit Organizations Regulatory Authority (PBORA). It helps organisations identify compliance strengths, gaps, and areas requiring corrective action.",
  ],
  guidance:
    "Answer based on your organisation's current status and records. Where a question refers to the reporting period, this means your organisation's most recently completed financial year.",
  statusQuestion: "What is the organisation's status?",
  statusOptions: [
    { value: "national", label: "National PBO" },
    { value: "ipbo", label: "International PBO (IPBO)" },
    { value: "exempt", label: "Exempt IPBO" },
    { value: "bestowed", label: "Organisation granted (bestowed) PBO status" },
  ],
};

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "general",
    title: "Section B: General compliance requirements",
    description: "Applies to National PBOs and IPBOs.",
    appliesTo: REGISTERED,
    questions: [
      {
        id: "b-1",
        group: "Governance",
        label: "Does the organisation have a governing body responsible for overseeing the organisation?",
      },
      {
        id: "b-2",
        group: "Governance",
        label:
          "Are the roles and responsibilities of the governing body provided for in the organisation's constitution or other governing document?",
      },
      {
        id: "b-3",
        group: "Governance",
        label: "Are decisions of the governing body formally recorded and retained?",
        hint: "Examples: meeting minutes; board resolutions; committee decisions.",
      },
      {
        id: "b-4",
        group: "Public benefit purpose",
        label:
          "Does the organisation continue to carry out activities that support its stated public benefit purposes?",
      },
      {
        id: "b-5",
        group: "Public benefit purpose",
        label: "Are the organisation's funds, assets and resources used to support its public benefit purposes?",
      },
      {
        id: "b-6",
        group: "Financial accountability",
        label: "Does the organisation maintain records of income, expenditure, assets and liabilities?",
      },
      {
        id: "b-7",
        group: "Financial accountability",
        label:
          "Are financial transactions supported by records such as invoices, receipts, payment vouchers, contracts or bank records?",
      },
      {
        id: "b-8",
        group: "Financial accountability",
        label: "Does the organisation prepare annual financial statements?",
      },
    ],
  },
  {
    id: "national",
    title: "Section C: Registered National PBOs",
    appliesTo: ["national"],
    questions: [
      {
        id: "c-1",
        group: "Registration",
        label:
          "Is the organisation registered or legally recognised as a PBO under the PBO Act (registration certificate available)?",
      },
      {
        id: "c-2",
        group: "Governing body composition",
        label: "Does the governing body have at least five members?",
      },
      {
        id: "c-3",
        group: "Governing body composition",
        label: "Are at least three governing body members unrelated to one another?",
      },
      {
        id: "c-4",
        group: "Annual reporting",
        label: "Has the organisation submitted its annual report within six months after the end of its financial year?",
      },
      {
        id: "c-5",
        group: "Annual reporting",
        label: "Does the organisation have its annual financial statements audited by an independent auditor?",
      },
    ],
  },
  {
    id: "ipbo",
    title: "Section D: Registered International PBOs",
    appliesTo: ["ipbo"],
    questions: [
      {
        id: "d-1",
        group: "Registration",
        label: "Does the organisation have a valid registration certificate as an International PBO?",
      },
      {
        id: "d-2",
        group: "Governing body composition",
        label: "Is at least one-third of the governing body made up of Kenyan citizens resident in Kenya?",
      },
      {
        id: "d-3",
        group: "Authorised representation",
        label: "Has the organisation appointed and maintained an authorised agent in Kenya?",
      },
      {
        id: "d-4",
        group: "Annual reporting",
        label: "Has the organisation submitted its annual report within six months after the end of its financial year?",
      },
      {
        id: "d-5",
        group: "Annual reporting",
        label: "Does the organisation have its annual financial statements audited by an independent auditor?",
      },
    ],
  },
  {
    id: "exempt",
    title: "Section E: Exempt IPBOs",
    appliesTo: ["exempt"],
    questions: [
      {
        id: "e-1",
        group: "Exemption status",
        label: "Does the organisation hold a valid exemption permit issued under the PBO framework?",
      },
      {
        id: "e-2",
        group: "Activities covered by the exemption",
        label:
          "Are the organisation's activities in Kenya consistent with the basis upon which the exemption was granted?",
        hint:
          "Examples may include: grant-making; technical assistance; capacity strengthening; research; policy support; collaboration with local partners.",
      },
      {
        id: "e-3",
        group: "Conditions of exemption",
        label: "Does the organisation continue to comply with all conditions attached to its exemption?",
        hint:
          "Examples may include: maintaining any required representation in Kenya; carrying out only permitted activities; complying with any reporting or notification conditions attached to the exemption.",
      },
    ],
  },
  {
    id: "bestowed",
    title: "Section F: Organisations granted (bestowed) PBO status",
    appliesTo: ["bestowed"],
    questions: [
      {
        id: "f-1",
        group: "Continuing eligibility",
        label:
          "Is the organisation still legally registered or incorporated under the law through which it originally obtained its legal status?",
      },
      {
        id: "f-2",
        group: "Continuing eligibility",
        label:
          "Has the organisation's registration, licence, charter or legal status remained valid and free from suspension, cancellation or other regulatory restriction during the reporting period?",
      },
      {
        id: "f-3",
        group: "Continuing eligibility",
        label:
          "Does the organisation continue to carry out public benefit activities consistent with the purposes for which PBO status was granted?",
      },
    ],
  },
  {
    id: "material-changes",
    title: "Section G: Material changes",
    description:
      "Assesses whether the organisation has reported important changes to PBORA in accordance with the applicable requirements.",
    questions: [
      {
        id: "g-1",
        group: "Governing body changes",
        appliesTo: REGISTERED,
        kind: "trigger",
        label: "Did the organisation change any members of its governing body during the reporting period?",
        followUps: [
          { id: "g-1a", label: "Did the organisation notify PBORA within 30 days after the change?" },
        ],
      },
      {
        id: "g-2",
        group: "Constitution changes",
        appliesTo: REGISTERED,
        kind: "trigger",
        label:
          "Did the organisation amend its constitution or other governing document during the reporting period?",
        followUps: [
          { id: "g-2a", label: "Did the organisation notify PBORA within 60 days after the amendment?" },
        ],
      },
      {
        id: "g-3",
        group: "Name changes",
        kind: "trigger",
        label: "Did the organisation initiate a change of its registered name during the reporting period?",
        followUps: [
          {
            id: "g-3a",
            appliesTo: REGISTERED,
            label:
              "Did the organisation submit Form 15 and the required documents to PBORA and obtain approval for the name change?",
          },
          {
            id: "g-3b",
            appliesTo: EXEMPT_OR_BESTOWED,
            label:
              "Did the organisation obtain approval from its principal regulator and notify PBORA within 30 days of receiving that approval?",
          },
        ],
      },
      {
        id: "g-4",
        group: "Address changes",
        appliesTo: REGISTERED,
        kind: "trigger",
        label:
          "Did the organisation change its registered physical address, postal address or principal place of operation during the reporting period?",
        followUps: [
          { id: "g-4a", label: "Did the organisation notify PBORA within 60 days after the change?" },
        ],
      },
      {
        id: "g-5",
        group: "Banking arrangements",
        appliesTo: REGISTERED,
        kind: "trigger",
        label: "Did the organisation change its banking arrangements during the reporting period?",
        followUps: [
          { id: "g-5a", label: "Did the organisation notify PBORA within 60 days after the change?" },
        ],
      },
      {
        id: "g-6",
        group: "Authorised agent changes",
        appliesTo: ["ipbo"],
        kind: "trigger",
        label: "Did the organisation change its authorised agent during the reporting period?",
        followUps: [
          { id: "g-6a", label: "Did the organisation notify PBORA of the change using the applicable procedure?" },
        ],
      },
      {
        id: "g-7",
        group: "Other material changes",
        appliesTo: EXEMPT_OR_BESTOWED,
        kind: "trigger",
        label:
          "Did the organisation make any changes to its governing body, constitution, address, banking arrangements or other registered details during the reporting period?",
        followUps: [
          {
            id: "g-7a",
            label: "Did the organisation obtain approval from its principal regulator before making the changes?",
          },
          { id: "g-7b", label: "Did the organisation notify PBORA within 30 days after receiving that approval?" },
        ],
      },
    ],
  },
  {
    id: "income",
    title: "Section H: Income-generating activities",
    description: "Applies to National PBOs and IPBOs.",
    appliesTo: REGISTERED,
    questions: [
      {
        id: "h-1",
        kind: "trigger",
        label: "Did the organisation carry out income-generating activities during the reporting period?",
        followUps: [
          {
            id: "h-1a",
            label: "Were the income-generating activities consistent with the organisation's public benefit purposes?",
          },
          {
            id: "h-1b",
            label: "Did the organisation obtain any licences, permits or authorisations required for these activities?",
          },
          {
            id: "h-1c",
            label:
              "Were proceeds from the income-generating activities used to support the organisation's public benefit purposes?",
          },
          {
            id: "h-1d",
            label: "Does the organisation maintain records of income and expenditure relating to those activities?",
          },
        ],
      },
    ],
  },
  {
    id: "regulatory",
    title: "Section I: Regulatory actions",
    questions: [
      {
        id: "i-1",
        kind: "trigger",
        label:
          "Has the organisation received a formal compliance notice, directive, suspension or cancellation decision from PBORA during the reporting period?",
        followUps: [
          {
            id: "i-1a",
            label: "Has the organisation completed the actions required under the notice, directive or decision?",
          },
        ],
      },
    ],
  },
];

export const CHECKLIST_STORAGE_KEY = "creco-checklist-progress";

const ORG_STATUSES: OrgStatus[] = ["national", "ipbo", "exempt", "bestowed"];

function appliesTo(audience: OrgStatus[] | undefined, status: OrgStatus) {
  return !audience || audience.includes(status);
}

/** Reads saved data, discarding the pre-2026 tick-box format. */
export function normalizeChecklistState(value: unknown): ChecklistState {
  if (value && typeof value === "object" && (value as ChecklistState).version === 2) {
    const raw = value as ChecklistState;
    const answers: Record<string, ChecklistAnswer> = {};
    for (const [id, answer] of Object.entries(raw.answers ?? {})) {
      if (answer === "yes" || answer === "no") answers[id] = answer;
    }
    return {
      version: 2,
      status: raw.status && ORG_STATUSES.includes(raw.status) ? raw.status : undefined,
      answers,
    };
  }
  return { version: 2, answers: {} };
}

export function sectionsForStatus(sections: ChecklistSection[], status: OrgStatus) {
  return sections
    .filter((section) => appliesTo(section.appliesTo, status))
    .map((section) => ({
      ...section,
      questions: section.questions
        .filter((question) => appliesTo(question.appliesTo, status))
        .map((question) => ({
          ...question,
          followUps: question.followUps?.filter((followUp) => appliesTo(followUp.appliesTo, status)),
        })),
    }))
    .filter((section) => section.questions.length > 0);
}

export type ScoredQuestion = {
  question: ChecklistQuestion;
  answer?: ChecklistAnswer;
};

/**
 * Questions that currently count towards the score for one section: requirements,
 * plus follow-ups of triggers answered "Yes".
 */
export function scoredQuestions(
  section: ChecklistSection,
  answers: Record<string, ChecklistAnswer>,
): ScoredQuestion[] {
  const scored: ScoredQuestion[] = [];
  for (const question of section.questions) {
    if (question.kind === "trigger") {
      if (answers[question.id] !== "yes") continue;
      for (const followUp of question.followUps ?? []) {
        scored.push({ question: followUp, answer: answers[followUp.id] });
      }
    } else {
      scored.push({ question, answer: answers[question.id] });
    }
  }
  return scored;
}

/** Every question currently visible in a section (triggers, requirements, and opened follow-ups). */
export function visibleQuestions(section: ChecklistSection, answers: Record<string, ChecklistAnswer>) {
  return section.questions.flatMap((question) => [
    question,
    ...(answers[question.id] === "yes" ? (question.followUps ?? []) : []),
  ]);
}
