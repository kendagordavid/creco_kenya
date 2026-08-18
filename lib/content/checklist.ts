export type ChecklistSection = {
  id: string;
  title: string;
  items: { id: string; label: string }[];
};

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "governance",
    title: "Governance",
    items: [
      { id: "gov-1", label: "Board charter or terms of reference adopted" },
      { id: "gov-2", label: "Conflict-of-interest policy in place" },
      { id: "gov-3", label: "Board meetings held at least quarterly" },
      { id: "gov-4", label: "Minutes signed and filed" },
      { id: "gov-5", label: "Office bearers' details updated with Authority if changed" },
      { id: "gov-6", label: "Delegation of authority documented" },
    ],
  },
  {
    id: "registration",
    title: "Registration documents",
    items: [
      { id: "reg-1", label: "Certificate of registration accessible" },
      { id: "reg-2", label: "Constitution matches registered objects" },
      { id: "reg-3", label: "Registered office address current" },
      { id: "reg-4", label: "Signatory list updated at bank" },
      { id: "reg-5", label: "Change-of-name or objects filings complete (if any)" },
      { id: "reg-6", label: "Public registry entry reviewed annually" },
    ],
  },
  {
    id: "reporting",
    title: "Reporting obligations",
    items: [
      { id: "rep-1", label: "Annual return filed on time" },
      { id: "rep-2", label: "Financial statements prepared" },
      { id: "rep-3", label: "Audit or independent review completed (if required)" },
      { id: "rep-4", label: "Activity report describes public benefit outcomes" },
      { id: "rep-5", label: "Tax and statutory deductions remitted" },
      { id: "rep-6", label: "Donor reporting schedules met" },
    ],
  },
  {
    id: "operations",
    title: "Operations & safeguarding",
    items: [
      { id: "ops-1", label: "Data protection and privacy notice published" },
      { id: "ops-2", label: "Safeguarding policy for programmes" },
      { id: "ops-3", label: "Procurement policy for grants and contracts" },
      { id: "ops-4", label: "Whistleblowing or complaints mechanism" },
      { id: "ops-5", label: "Insurance reviewed annually" },
      { id: "ops-6", label: "Asset register maintained" },
    ],
  },
];

export const CHECKLIST_STORAGE_KEY = "creco-checklist-progress";
