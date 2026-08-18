export type ToolkitItem = {
  slug: string;
  title: string;
  summary: string;
  sections: string[];
};

export const TOOLKIT_ITEMS: ToolkitItem[] = [
  {
    slug: "registration-starter-pack",
    title: "PBO registration starter pack",
    summary: "Step-by-step guide for first-time applicants preparing documents.",
    sections: [
      "Confirm eligibility and objects",
      "Draft or revise constitution",
      "Collect office bearer IDs and CVs",
      "Prepare registered office evidence",
      "Complete Authority application forms",
      "Board resolution authorising application",
    ],
  },
  {
    slug: "governance-basics",
    title: "Governance basics for small PBOs",
    summary: "Lightweight governance toolkit for community organisations.",
    sections: [
      "Board roles and meeting rhythm",
      "Financial oversight essentials",
      "Conflict of interest declarations",
      "Document retention schedule",
      "Induction pack for new trustees",
    ],
  },
  {
    slug: "reporting-toolkit",
    title: "Annual reporting toolkit",
    summary: "Prepare annual returns and public benefit narratives.",
    sections: [
      "Timeline aligned to Authority deadlines",
      "Financial statement checklist",
      "Programme indicators worksheet",
      "Board sign-off procedures",
      "Filing confirmation and archive",
    ],
  },
];

export function getToolkitBySlug(slug: string) {
  return TOOLKIT_ITEMS.find((t) => t.slug === slug);
}

export type MediaItem = {
  id: string;
  title: string;
  type: "video" | "infographic" | "guide";
  duration?: string;
  summary: string;
};

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "media-1",
    title: "Introduction to the PBO Act, 2013",
    type: "video",
    duration: "8 min",
    summary: "Overview of why the Act was introduced and who it covers.",
  },
  {
    id: "media-2",
    title: "Registration process walkthrough",
    type: "video",
    duration: "12 min",
    summary: "Visual guide to application steps and common documentation.",
  },
  {
    id: "media-3",
    title: "PBO Regulatory Authority roles",
    type: "infographic",
    summary: "One-page diagram of Authority functions and public registry.",
  },
  {
    id: "media-4",
    title: "Compliance calendar",
    type: "infographic",
    summary: "Annual reporting and board meeting rhythm at a glance.",
  },
  {
    id: "media-5",
    title: "Know your governing documents",
    type: "guide",
    summary: "Plain-language explainer on constitution essentials.",
  },
];
