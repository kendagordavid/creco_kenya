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
  { slug: "penalties", title: "Penalties & compliance", count: 4 },
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    slug: "what-is-a-pbo",
    category: "registration",
    question: "What is a Public Benefit Organization (PBO)?",
    answer:
      "A Public Benefit Organization (PBO) is a voluntary, non-profit organisation established by individuals or organisations to promote public benefit rather than generate profits for private gain. Under Kenya's Public Benefit Organizations Act, 2013, qualifying organisations can register with the PBO Regulatory Authority and acquire legal recognition to operate within the regulatory framework governing PBOs in Kenya.\n\nPBOs work in areas such as human rights, democracy, governance, education, health, environmental protection, community development and social justice.",
  },
  {
    slug: "who-can-register",
    category: "registration",
    question: "Who can register as a PBO?",
    answer:
      "Any eligible non-profit organisation established to serve the public interest may apply for registration as a PBO, provided it meets the requirements of the PBO Act, 2013.\n\nEligible organisations may include non-governmental organisations, community-based organisations, foundations, trusts and other voluntary associations that meet the prescribed legal requirements. Applicants must demonstrate a public benefit purpose, non-profit character and appropriate governance arrangements.",
  },
  {
    slug: "registration-documents",
    category: "registration",
    question: "What documents are required for PBO registration?",
    answer:
      "Organisations seeking registration should prepare the relevant application forms and supporting documents required by the PBO Regulatory Authority. The forms are filled in and the documents uploaded through eCitizen.\n\nThese generally include:\n\n- Personal particulars (contacts and addresses) of the proposed top three officials (Chairperson, Secretary and Treasurer) and the board members, in the prescribed format.\n- A scanned copy of the proposed organisation's constitution, signed by all the board members (PDF not exceeding 2.5 MB).\n- Sample signatures of all the board members, in blue ink on a plain white background.\n- Scanned copies of current coloured passport-size photographs of the intended officials (size 2 × 2, taken on a white background).\n- A valid police clearance certificate (not more than one year old), or a notarised police clearance certificate from the country of residence for non-Kenyans.\n- A scanned copy of the bio-data page of a foreign official's passport.\n- Scanned minutes of the proposed organisation resolving to register the PBO and electing the interim officials, signed by the top three officials. The minutes must not be more than 14 days old from the date of the meeting.\n- Contact details and the physical and postal address of the proposed organisation.\n- A list of the counties the PBO intends to operate in (a maximum of five). Expanding to more counties needs a separate application to the Authority after registration.\n- A one-year estimated budget of the intended operations of the PBO.",
  },
  {
    slug: "registration-timeline",
    category: "registration",
    question: "How long does PBO registration take?",
    answer:
      "The PBO Act, 2013 and the PBO Regulations, 2026 provide that registration applications should be considered within 60 days. The actual processing period may depend on the completeness of the application, compliance with legal requirements and whether the Authority requests additional information or clarification.\n\nOrganisations should obtain an acknowledgement of their application, follow up on its progress and promptly address any issues raised by the Authority. If an application is delayed beyond the applicable timeline, the organisation should seek clarification and keep a record of its follow-up.",
  },
  {
    slug: "registration-fees",
    category: "registration",
    question: "Are there registration fees for PBOs?",
    answer:
      "Yes. Registration and other regulatory services attract prescribed fees, depending on the application or service being sought:\n\n- Name search and reservation: KES 1,000\n- Registration of a national PBO: KES 25,000\n- Registration of an international PBO: KES 45,000\n- Bestowment: KES 20,000\n\nAlways request and retain official payment receipts and avoid making payments through unauthorised individuals or channels.",
  },
  {
    slug: "change-of-particulars",
    category: "registration",
    question: "How do we update our registered particulars?",
    answer:
      "A registered PBO must notify the PBO Regulatory Authority whenever there are changes to its official registration details or other particulars requiring notification or approval.\n\nSuch changes may include:\n\n- Changes in the organisation's name or physical address.\n- Appointment, resignation or replacement of board members or officials.\n- Amendments to the constitution or governing documents.\n- Changes to the organisation's objectives or governance structure.\n\nThe organisation should document the relevant decisions through properly constituted board or membership resolutions and submit the required notifications or applications within the prescribed timelines.",
  },
  {
    slug: "board-responsibilities",
    category: "governance",
    question: "What are the PBO board's core responsibilities?",
    answer:
      "The board is responsible for providing strategic leadership, oversight and accountability to ensure that the organisation fulfils its public benefit mandate.\n\nIts key responsibilities include:\n\n- Providing strategic direction and approving organisational policies.\n- Ensuring responsible management of finances and organisational assets.\n- Overseeing programme implementation and performance.\n- Ensuring compliance with the PBO Act, 2013, the Regulations and other applicable laws.\n- Promoting transparency, accountability and ethical leadership.\n- Managing organisational risks and conflicts of interest.\n- Holding management accountable for organisational performance.\n\nAn effective board provides oversight without interfering unnecessarily in the day-to-day management of the organisation.",
  },
  {
    slug: "constitution-requirements",
    category: "governance",
    question: "What should our organisation's constitution include?",
    answer:
      "A constitution is the foundational governance document of a PBO. It establishes the organisation's identity, purpose, governance arrangements and operating procedures.\n\nA comprehensive constitution should clearly provide for:\n\n- The organisation's name, vision, mission and objectives.\n- Membership eligibility, rights and responsibilities, where applicable.\n- Governance structures, including the board and management.\n- Appointment, tenure, roles and removal of officials.\n- Procedures for meetings, decision-making and voting.\n- Financial management and accountability mechanisms.\n- Conflict-of-interest management.\n- Procedures for amending the constitution.\n- Dissolution procedures and the distribution of remaining assets in accordance with the law.\n\nThe constitution should comply with the PBO Act, 2013 and the PBO Regulations, 2026 while reflecting the organisation's specific mandate and operating context.",
  },
  {
    slug: "conflict-of-interest",
    category: "governance",
    question: "How should conflicts of interest be handled?",
    answer:
      "PBOs should establish clear procedures for identifying, declaring, documenting and managing actual, potential or perceived conflicts of interest.\n\nBoard members, staff and other decision-makers should disclose any personal, financial or professional interests that could influence their organisational responsibilities.\n\nWhere a conflict arises, the affected individual should:\n\n- Declare the conflict promptly.\n- Ensure the declaration is recorded in the relevant register or meeting minutes.\n- Refrain from participating in discussions or decisions where appropriate.\n- Avoid using their organisational position for personal benefit.\n\nOrganisations should adopt a written conflict-of-interest policy and regularly review compliance with it. Transparency in managing conflicts protects organisational integrity and public trust.",
  },
  {
    slug: "annual-general-meeting",
    category: "governance",
    question: "Must a PBO hold an Annual General Meeting (AGM)?",
    answer:
      "The requirement to hold an AGM depends on the organisation's legal structure, constitution and applicable regulatory requirements.\n\nMembership-based PBOs should hold AGMs in accordance with their constitutions and applicable legal provisions. Non-membership PBOs should follow their established governance arrangements and applicable legal requirements.\n\nRegardless of the organisational structure, important governance decisions should be properly documented. Organisations should maintain meeting notices, attendance records, minutes, resolutions and relevant reports as evidence of accountability.",
  },
  {
    slug: "annual-reporting",
    category: "reporting",
    question: "What annual reporting is required for registered PBOs?",
    answer:
      "Registered PBOs are required to meet the annual reporting and filing obligations prescribed under the PBO Act, 2013 and the PBO Regulations, 2026.\n\nDepending on the organisation's circumstances and the Authority's requirements, these may include:\n\n- Annual returns and organisational reports.\n- Audited or independently examined financial statements, where applicable.\n- Reports on programmes, activities and achievements.\n- Information on funding sources and expenditure.\n- Details of changes in governance or registered particulars.\n\nOrganisations should maintain an annual compliance calendar, submit reports within the prescribed deadlines and retain evidence of all filings. Failure to meet reporting obligations may affect an organisation's regulatory standing.",
  },
  {
    slug: "financial-records",
    category: "reporting",
    question: "How should a PBO maintain its financial records?",
    answer:
      "Every PBO should maintain accurate, complete and up-to-date financial records to demonstrate responsible stewardship of resources and compliance with applicable laws and donor requirements.\n\nGood financial management practices include:\n\n- Maintaining proper books of accounts.\n- Recording all income, expenditure, assets and liabilities.\n- Keeping receipts, invoices, payment vouchers and supporting documents.\n- Conducting regular bank reconciliations.\n- Maintaining approved budgets and expenditure controls.\n- Separating financial authorisation, payment and reconciliation responsibilities where practicable.\n- Preparing periodic financial reports for board oversight.\n\nFinancial records should be securely maintained and made available for audits, regulatory reviews and other authorised accountability processes.",
  },
  {
    slug: "audit-requirements",
    category: "reporting",
    question: "When is an audit required for a PBO?",
    answer:
      "PBOs must comply with the financial reporting and audit requirements applicable to their category and circumstances under the PBO Act, 2013, the PBO Regulations, 2026 and other relevant laws.\n\nWhether an audit is mandatory may depend on the organisation's financial position, applicable regulatory thresholds and any additional statutory or funding requirements.\n\nOrganisations should confirm their specific audit obligations with the PBO Regulatory Authority and engage qualified independent auditors where required. Even where a statutory audit is not mandatory, independent financial reviews can strengthen transparency, donor confidence and organisational accountability.",
  },
  {
    slug: "public-benefit-reporting",
    category: "reporting",
    question: "How do we demonstrate that our organisation is providing public benefit?",
    answer:
      "A PBO should be able to demonstrate that its programmes, resources and activities contribute meaningfully to the public benefit objectives for which it was established.\n\nThis requires more than simply listing activities. Organisations should demonstrate who benefits, what changes are achieved and how their interventions contribute to addressing community needs.\n\nPractical ways to demonstrate public benefit include:\n\n- Maintaining records of beneficiaries and communities reached.\n- Documenting programmes, activities and geographical coverage.\n- Establishing measurable performance and impact indicators.\n- Collecting beneficiary feedback and documenting outcomes.\n- Preparing annual programme and impact reports.\n- Demonstrating alignment between organisational activities and registered objectives.\n\nEvidence of public benefit strengthens organisational credibility and demonstrates accountability to communities, donors, regulators and other stakeholders.",
  },
  {
    slug: "non-compliance-consequences",
    category: "penalties",
    question: "What happens if a PBO fails to comply with the law?",
    answer:
      "Failure to comply with the PBO Act, 2013, the PBO Regulations, 2026 or registration conditions can expose an organisation and, where applicable, responsible individuals to regulatory action.\n\nDepending on the nature and seriousness of the violation, possible consequences may include regulatory directives, penalties, suspension or cancellation of registration, subject to applicable legal procedures and safeguards.\n\nOrganisations should take compliance seriously, address identified gaps promptly and cooperate with lawful regulatory requirements. Strong internal governance and regular compliance reviews can help prevent violations and protect organisational continuity.",
  },
  {
    slug: "late-filing",
    category: "penalties",
    question: "Can late filing of annual returns or reports be remedied?",
    answer:
      "Yes. An organisation that has missed a filing deadline should take immediate steps to regularise its compliance status.\n\nThe organisation should:\n\n- Contact the PBO Regulatory Authority to establish its outstanding obligations.\n- Prepare and submit overdue returns or reports.\n- Provide explanations or supporting documentation where requested.\n- Pay any applicable prescribed fees or penalties.\n- Document corrective actions and establish measures to prevent future delays.\n\nWhere necessary, the organisation should formally seek guidance from the Authority on the process for regularising its compliance status. Prompt action is important in minimising further regulatory consequences.",
  },
  {
    slug: "operating-without-registration",
    category: "penalties",
    question: "Can an organisation operate before its PBO registration is complete?",
    answer:
      "An organisation should not claim to be a registered PBO or present itself as having registration status before receiving formal confirmation from the PBO Regulatory Authority.\n\nHowever, whether it can undertake activities while an application is being processed depends on its existing legal status and the applicable legal and regulatory requirements.\n\nOrganisations operating under another valid legal registration should ensure that their activities remain lawful and consistent with the obligations attached to that registration. They should also avoid making representations that could mislead beneficiaries, donors or partners about their registration status.\n\nOrganisations should seek clarification from the Authority where there is uncertainty about their legal position during the transition to PBO registration.",
  },
  {
    slug: "deregistration-reasons",
    category: "penalties",
    question: "For what reasons can a PBO be deregistered?",
    answer:
      "Under Regulation 34(1) of the PBO Regulations, 2026, PBORA may deregister a PBO if it fails to comply with the requirements of the Act or its Regulations; fails to carry out the public benefit activities or objectives for which it was registered for a continuous period of three years; engages in activities involving money laundering or other economic crimes; or violates or contravenes any other applicable written law in Kenya. Section 19 of the PBO Act, 2013 also allows cancellation for violations of the Act or where the organization has ceased to exist. A court may order deregistration, and a PBO may deregister voluntarily. Before deregistering, the Authority must give written reasons, a chance to be heard, and time to take remedial action.",
  },
];

/** The first paragraph of an answer, for previews and search snippets. */
export function faqSummary(answer: string) {
  return answer.split("\n\n")[0];
}

export function getFaqsByCategory(category: string) {
  return FAQ_ITEMS.filter((item) => item.category === category);
}

export function getFaqBySlug(slug: string) {
  return FAQ_ITEMS.find((item) => item.slug === slug);
}
