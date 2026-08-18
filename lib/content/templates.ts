export type TemplateItem = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  format: string;
  body: string;
};

export const TEMPLATE_ITEMS: TemplateItem[] = [
  {
    slug: "board-resolution-registration",
    title: "Board resolution — registration application",
    summary: "Authorise submission of PBO registration application and named signatories.",
    category: "Governance",
    format: "DOCX-style outline",
    body: `RESOLUTION OF THE BOARD OF [ORGANISATION NAME]
Date: [DATE]

RESOLVED THAT:
1. The organisation apply for registration as a Public Benefit Organization under the PBO Act, 2013.
2. [NAME, TITLE] be authorised to sign and submit all registration forms and supporting documents.
3. The constitution attached as Appendix A be adopted as the governing document for registration purposes.

Certified by:
Chairperson: ___________________  Date: _______
Secretary: ____________________  Date: _______`,
  },
  {
    slug: "conflict-of-interest-policy",
    title: "Conflict of interest policy",
    summary: "Template policy for board and staff declaration and recusal.",
    category: "Governance",
    format: "Policy outline",
    body: `CONFLICT OF INTEREST POLICY — [ORGANISATION NAME]

1. Purpose
To protect the integrity of decision-making and public trust.

2. Scope
Applies to board members, staff, and volunteers with decision-making authority.

3. Declaration
Members shall declare personal, financial, or familial interests related to agenda items.

4. Recusal
Affected members shall not participate in discussion or vote on conflicted matters.

5. Record-keeping
Declarations shall be recorded in minutes.

Approved: [DATE]  Review due: [DATE]`,
  },
  {
    slug: "annual-return-checklist",
    title: "Annual return preparation checklist",
    summary: "Internal checklist before filing annual returns with the Authority.",
    category: "Reporting",
    format: "Checklist",
    body: `ANNUAL RETURN PREPARATION — [YEAR]

□ Financial statements signed by board
□ Activity report summarising programmes and beneficiaries
□ Updated office bearers list
□ Registration certificate copy attached
□ Auditor report (if applicable)
□ Filing fee confirmed
□ Submission copy filed internally`,
  },
  {
    slug: "membership-register",
    title: "Membership register template",
    summary: "Simple register for membership-based PBOs.",
    category: "Governance",
    format: "Register",
    body: `MEMBERSHIP REGISTER — [ORGANISATION NAME]

| No. | Full name | ID/Contact | Date joined | Status |
|-----|-----------|------------|-------------|--------|
| 1   |           |            |             | Active |

Maintained by: [SECRETARY NAME]
Last updated: [DATE]`,
  },
  {
    slug: "programme-report",
    title: "Programme activity report",
    summary: "Narrative and indicators template for annual reporting.",
    category: "Reporting",
    format: "Report outline",
    body: `PROGRAMME ACTIVITY REPORT — [PERIOD]

1. Summary of public benefit activities
2. Beneficiaries reached (disaggregated where possible)
3. Partnerships and geographic coverage
4. Challenges and mitigation
5. Link to registered objects under the PBO Act
6. Financial summary (high level)

Prepared by: _____________  Approved by board: _____________`,
  },
];

export function getTemplateBySlug(slug: string) {
  return TEMPLATE_ITEMS.find((t) => t.slug === slug);
}
