export type FaqItem = {
  slug: string;
  question: string;
  answer: string;
  category: string;
};

export const FAQ_CATEGORIES = [
  { slug: "registration", title: "Registration", count: 6 },
  { slug: "governance", title: "Governance", count: 4 },
  { slug: "reporting", title: "Reporting", count: 4 },
  { slug: "penalties", title: "Penalties & compliance", count: 3 },
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    slug: "what-is-a-pbo",
    category: "registration",
    question: "What is a Public Benefit Organization (PBO)?",
    answer:
      "A PBO is a voluntary membership or non-membership grouping of individuals or organizations operated for public benefit. Under the PBO Act, 2013, qualifying organisations register with the PBO Regulatory Authority to obtain legal personality and operate under a unified regulatory framework.",
  },
  {
    slug: "who-can-register",
    category: "registration",
    question: "Who can register as a PBO?",
    answer:
      "Non-profit entities established for public benefit — including NGOs, community-based organisations, foundations, and trusts — may apply if they meet eligibility criteria in the Act and submit required documentation.",
  },
  {
    slug: "registration-documents",
    category: "registration",
    question: "What documents are required for registration?",
    answer:
      "Typical requirements include constitution or governing documents, registration application forms, details of office bearers, proof of address, and any sector-specific attachments. See the registration requirements topic for the compiled checklist.",
  },
  {
    slug: "registration-timeline",
    category: "registration",
    question: "How long does registration take?",
    answer:
      "The Act sets timelines for Authority decisions on applications. Delays may occur where documentation is incomplete or additional information is requested. Track your experience via the monitoring module if you encounter barriers.",
  },
  {
    slug: "registration-fees",
    category: "registration",
    question: "Are there registration fees?",
    answer:
      "Fee schedules are published by the PBO Regulatory Authority. Organisations should verify current fees on official Authority communications before submitting applications.",
  },
  {
    slug: "change-of-particulars",
    category: "registration",
    question: "How do we update registered particulars?",
    answer:
      "Material changes to governance, name, or objects typically require notification or approval by the Authority. Maintain board minutes and file updates within prescribed timelines.",
  },
  {
    slug: "board-responsibilities",
    category: "governance",
    question: "What are the board's core responsibilities?",
    answer:
      "The board oversees strategy, financial stewardship, compliance with the Act, and accountability to members and beneficiaries. Good governance includes documented policies, regular meetings, and conflict-of-interest management.",
  },
  {
    slug: "constitution-requirements",
    category: "governance",
    question: "What should our constitution include?",
    answer:
      "A constitution should define objects, membership, governance structures, meeting rules, financial controls, and amendment procedures — aligned with PBO Act requirements and your organisation's mission.",
  },
  {
    slug: "conflict-of-interest",
    category: "governance",
    question: "How should conflicts of interest be handled?",
    answer:
      "Adopt a written conflict-of-interest policy. Board members should declare interests and recuse themselves from decisions where they have a personal stake.",
  },
  {
    slug: "annual-general-meeting",
    category: "governance",
    question: "Must we hold an AGM?",
    answer:
      "Membership-based organisations typically hold AGMs as set out in their constitution. Document attendance, resolutions, and reporting even when the Act allows flexible structures for non-membership PBOs.",
  },
  {
    slug: "annual-reporting",
    category: "reporting",
    question: "What annual reporting is required?",
    answer:
      "Registered PBOs must file annual returns and reports as prescribed by the Authority, including financial statements and activity summaries. Missing deadlines can affect good-standing status.",
  },
  {
    slug: "financial-records",
    category: "reporting",
    question: "How should we maintain financial records?",
    answer:
      "Keep accurate books of account, bank reconciliations, and supporting vouchers. Many organisations adopt a simple chart of accounts and periodic internal review before audit or board approval.",
  },
  {
    slug: "audit-requirements",
    category: "reporting",
    question: "When is an audit required?",
    answer:
      "Audit thresholds depend on income and Authority rules. Even when not mandatory, periodic independent review strengthens accountability to donors and members.",
  },
  {
    slug: "public-benefit-reporting",
    category: "reporting",
    question: "How do we demonstrate public benefit?",
    answer:
      "Document programmes, beneficiaries, and outcomes in annual reports. Link activities to your registered objects and maintain evidence of community impact.",
  },
  {
    slug: "non-compliance-consequences",
    category: "penalties",
    question: "What happens if we fail to comply?",
    answer:
      "Non-compliance with registration conditions, reporting, or governance requirements can lead to penalties, suspension, or cancellation of registration depending on severity and remedial action taken.",
  },
  {
    slug: "late-filing",
    category: "penalties",
    question: "Can late filing be remedied?",
    answer:
      "Organisations should contact the Authority promptly, file overdue returns, and document corrective steps. Proactive compliance reduces enforcement risk.",
  },
  {
    slug: "operating-without-registration",
    category: "penalties",
    question: "Can we operate before registration is complete?",
    answer:
      "Organisations should not represent themselves as registered PBOs until the Authority confirms registration. Interim activities may continue under prior legal forms where applicable.",
  },
];

export function getFaqsByCategory(category: string) {
  return FAQ_ITEMS.filter((item) => item.category === category);
}

export function getFaqBySlug(slug: string) {
  return FAQ_ITEMS.find((item) => item.slug === slug);
}
