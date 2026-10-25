/**
 * Forms in the Second Schedule of the PBO Regulations, 2026 (Legal Notice No. 43).
 * `pages` are the page numbers in public/documents/pbo-regulations-2026.pdf; run
 * `npm run forms:build` after changing them to regenerate the previews in public/forms.
 */
export type RegulationForm = {
  id: string;
  name: string;
  purpose: string;
  pages: readonly [number, number];
};

export const REGULATION_FORMS: readonly RegulationForm[] = [
  {
    id: "1",
    name: "Form 1",
    purpose: "Application for registration as a PBO or international PBO.",
    pages: [24, 29],
  },
  {
    id: "2",
    name: "Form 2",
    purpose: "Certificate of registration as a PBO.",
    pages: [30, 30],
  },
  {
    id: "3",
    name: "Form 3",
    purpose: "Application for bestowment of PBO status.",
    pages: [31, 37],
  },
  {
    id: "4",
    name: "Form 4",
    purpose: "Certificate of bestowment of PBO status.",
    pages: [38, 38],
  },
  {
    id: "5",
    name: "Form 5",
    purpose: "Certificate of registration as an international PBO.",
    pages: [39, 39],
  },
  {
    id: "6",
    name: "Form 6",
    purpose: "Application for exemption from registration as an international PBO.",
    pages: [40, 44],
  },
  {
    id: "7",
    name: "Form 7",
    purpose: "Permit to operate as an exempt international PBO.",
    pages: [45, 45],
  },
  {
    id: "8",
    name: "Form 8",
    purpose: "Notice of intended cancellation or suspension of registration or permit.",
    pages: [46, 46],
  },
  {
    id: "9",
    name: "Form 9",
    purpose: "Cancellation or suspension of a certificate of registration.",
    pages: [47, 47],
  },
  {
    id: "10",
    name: "Form 10",
    purpose: "Application for restoration or reinstatement.",
    pages: [48, 48],
  },
  {
    id: "11",
    name: "Form 11",
    purpose: "Application for recognition of a forum, or of a federation of forums.",
    pages: [49, 50],
  },
  {
    id: "12",
    name: "Form 12",
    purpose: "Certificate of recognition of a forum or federation of forums.",
    pages: [51, 51],
  },
  {
    id: "13",
    name: "Form 13",
    purpose: "Annual report.",
    pages: [52, 55],
  },
  {
    id: "14",
    name: "Form 14",
    purpose: "Notification of material changes.",
    pages: [56, 56],
  },
  {
    id: "15",
    name: "Form 15",
    purpose: "Notice of change of name.",
    pages: [57, 57],
  },
  {
    id: "16",
    name: "Form 16",
    purpose: "Certificate of change of name.",
    pages: [58, 58],
  },
];

export function getRegulationForm(id: string) {
  return REGULATION_FORMS.find((form) => form.id === id);
}

export function formPdfPath(form: RegulationForm) {
  return `/forms/form-${form.id}.pdf`;
}

/** Preview image paths, one per page of the form. */
export function formPreviewPaths(form: RegulationForm) {
  const count = form.pages[1] - form.pages[0] + 1;
  return Array.from({ length: count }, (_, index) => `/forms/form-${form.id}-page-${index + 1}.jpg`);
}
