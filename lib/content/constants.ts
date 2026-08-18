export const KENYA_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
] as const;

export const ORG_TYPES = ["NGO", "CBO", "Foundation", "Trust", "Other"] as const;

export const ISSUE_TYPES = [
  "Delay",
  "Administrative barrier",
  "Documentation request",
  "Fee concern",
  "Other",
] as const;

export const INCIDENT_SEVERITIES = ["Low", "Medium", "High", "Critical"] as const;

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/knowledge", label: "Knowledge" },
  { href: "/compliance", label: "Compliance" },
  { href: "/guidance", label: "Guidance" },
  { href: "/monitoring", label: "Monitoring" },
] as const;

export const KNOWLEDGE_FILTERS = [
  { id: "all", label: "All" },
  { id: "guides", label: "Guides" },
  { id: "faqs", label: "FAQs" },
  { id: "toolkits", label: "Toolkits" },
  { id: "media", label: "Videos & media" },
] as const;
