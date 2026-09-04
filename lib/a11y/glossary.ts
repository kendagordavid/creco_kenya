export type GlossaryEntry = {
  term: string;
  definition: string;
};

/** Legal and civic terms used across PBO Act content — keyed by lowercase lookup. */
export const GLOSSARY: Record<string, GlossaryEntry> = {
  pbo: {
    term: "PBO",
    definition:
      "Public Benefit Organization — a non-profit entity registered under Kenya's Public Benefit Organizations Act, 2013 to pursue charitable, educational, religious, or other public-benefit purposes.",
  },
  "public benefit organization": {
    term: "Public Benefit Organization",
    definition:
      "An organization established for public benefit purposes and registered under the Public Benefit Organizations Act, 2013. PBOs must operate transparently and meet ongoing compliance requirements.",
  },
  "regulatory authority": {
    term: "Regulatory Authority",
    definition:
      "The government body responsible for overseeing PBO registration, compliance, and enforcement under the Public Benefit Organizations Act and its regulations.",
  },
  "public registry": {
    term: "Public Registry",
    definition:
      "The official register of Public Benefit Organizations maintained under the Act. Registration details and certain organisational information are recorded here for public access.",
  },
  "pbo act": {
    term: "PBO Act",
    definition:
      "The Public Benefit Organizations Act, 2013 — Kenya's primary law governing the registration, regulation, and operation of public benefit organizations.",
  },
  devolution: {
    term: "Devolution",
    definition:
      "The transfer of powers from the national government to county governments under Chapter Eleven of the Constitution of Kenya, 2010, giving counties authority over certain functions.",
  },
  "bill of rights": {
    term: "Bill of Rights",
    definition:
      "Chapter Four of the Constitution of Kenya, 2010 — the fundamental rights and freedoms guaranteed to every person in Kenya, including rights for persons with disabilities.",
  },
  compliance: {
    term: "Compliance",
    definition:
      "Meeting the legal obligations set out in the PBO Act and its regulations, including filing returns, maintaining records, and following governance requirements.",
  },
  registration: {
    term: "Registration",
    definition:
      "The formal process by which an organisation is entered into the Public Registry as a recognised Public Benefit Organization under the PBO Act.",
  },
};

/** Longest terms first so multi-word phrases match before single words. */
export const GLOSSARY_TERMS_SORTED = Object.keys(GLOSSARY).sort(
  (a, b) => b.length - a.length,
);
