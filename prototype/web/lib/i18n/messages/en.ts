export const en = {
  meta: {
    title: "CRECO PBO Act Platform",
    titleTemplate: "%s | CRECO PBO Act Platform",
    description:
      "Civic access and guidance on Kenya's Public Benefit Organizations Act, 2013 — for PBOs, community organisations, and partners.",
  },
  nav: {
    home: "Home",
    guidance: "Guidance",
    topics: "Topics",
    sources: "Sources",
    askQuestion: "Ask a question",
    toggleNav: "Toggle navigation",
    sectionNav: "Section navigation",
  },
  language: {
    label: "Language",
    switchTo: "Switch to {language}",
  },
  home: {
    eyebrow: "Civic access for PBOs · Kenya",
    title: "Navigate the PBO Act with clear, source-linked guidance",
    lead: "CRECO Kenya helps Public Benefit Organizations understand the Public Benefit Organizations Act, 2013 — through plain-language topics, searchable guidance, and references to approved legal materials.",
    lookUpGuidance: "Look up guidance",
    exploreTopics: "Explore topics",
    stats: {
      actCommenced: "Act commenced",
      topics: "Topics",
      languages: "Languages",
      partner: "Partner",
    },
    howItWorks: {
      eyebrow: "How it works",
      title: "Three ways to find what you need",
      lead: "Start with a question, browse topics, or go straight to the official documents.",
      open: "Open",
    },
    modules: {
      guidance: {
        title: "PBO Guidance",
        description:
          "Look up answers to registration and compliance questions, with links to source material.",
      },
      topics: {
        title: "Topic library",
        description:
          "Browse compiled pages on registration, the regulatory authority, and the Act's purpose.",
      },
      sources: {
        title: "Source documents",
        description: "View the approved PBO Act PDFs that every topic page is built from.",
      },
    },
    why: {
      eyebrow: "Why this platform",
      title: "Built for organisations on the ground",
      lead: "PBO staff and community organisations need practical answers — not legal jargon. Every topic page is compiled from approved materials, reviewable by CRECO before publication, and traceable to the original source documents.",
      points: [
        "Source-linked responses you can verify",
        "Plain language for non-lawyers",
        "Kiswahili questions supported",
        "Staff can update topics as laws change",
      ],
    },
    cta: {
      title: "Have a question about PBO registration?",
      lead: "Try a common question or type your own. Guidance draws from compiled topic pages and cites the sources used.",
      button: "Go to guidance tool",
    },
  },
  guidance: {
    metaTitle: "PBO Guidance",
    eyebrow: "Guidance tool",
    title: "PBO Act guidance",
    lead: "Ask a question in English or Kiswahili. Answers use CRECO's compiled topics when they match, and AI (when configured) to synthesize guidance or fill gaps from general PBO Act context.",
  },
  topics: {
    metaTitle: "Topics",
    eyebrow: "Knowledge base",
    title: "PBO Act topics",
    lead: "Structured guidance pages compiled from approved source documents. Each topic can be reviewed and updated by CRECO staff.",
    empty: "No topics available.",
    topicLabel: "Topic {number}",
    askAbout: "Ask about this topic",
  },
  sources: {
    metaTitle: "Sources",
    eyebrow: "Document library",
    title: "Approved source materials",
    lead: "Topic pages are compiled from these PBO Act documents. In production, CRECO controls which materials are included and when they are updated.",
    empty: "No sources listed.",
    viewPdf: "View PDF",
    control: {
      title: "Document control",
      lead: "Only CRECO-approved materials are compiled into topic pages. Staff can add Kiswahili summaries, plain-language guides, and updated regulations as they become available.",
    },
  },
  footer: {
    tagline:
      "Safeguarding civic space through legal awareness and monitoring of PBO Act implementation across Kenya.",
    platform: "Platform",
    pboGuidance: "PBO guidance",
    topicLibrary: "Topic library",
    sourceDocuments: "Source documents",
    partnership: "Partnership",
    partnershipText:
      "Developed with the International Center for Not-for-Profit Law (ICNL) as part of civic space safeguarding work in Kenya.",
    copyright: "© {year} CRECO Kenya",
    disclaimer: "Informational guidance only · Not legal advice",
  },
  questionComposer: {
    collapsedPrompt: "Ask about the PBO Act — registration, compliance, English or Kiswahili…",
    ask: "Ask →",
    exampleQuestions: "Example questions",
    yourQuestion: "Your question",
    minimize: "Minimize",
    questionChanged: "Question changed — submit for an updated answer.",
    label: "Your question about the PBO Act",
    placeholderEdit: "Edit your question…",
    placeholderAsk: "Ask a question (Shift+Enter for a new line)",
    submitHint: "Ctrl+Enter to submit · Shift+Enter for new line",
    getAnswer: "Get answer",
    updateAnswer: "Update answer",
    askAgain: "Ask again",
    askAnother: "Ask another question",
    starterQuestions: [
      "What documents do I need to register as a PBO?",
      "What is a Public Benefit Organization under the PBO Act?",
      "How long does the Authority have to decide on a registration application?",
      "Ni nini mahitaji ya kusajili shirika la faida ya umma?",
    ],
  },
  guidancePanel: {
    searching: "Searching topics and generating your answer…",
    updating: "Updating your answer…",
    answer: "Answer",
    badges: {
      noAnswer: "No answer",
      aiTopics: "AI · compiled topics",
      aiReference: "AI · general reference",
      compiledTopics: "Compiled topics",
    },
    referencesSupplemental:
      "References include compiled topics where relevant and general PBO Act resources.",
    referencesGrounded: "Grounded in {count} topic reference(s). See panel →",
    getStarted: "Open the question form above to get started.",
    recentQuestions: "Recent questions",
    errorFallback: "We could not retrieve an answer at this time. Please try again.",
  },
  sourceReferences: {
    eyebrow: "References",
    title: "Source material",
    lead: "Topic pages and approved documents used to form the guidance response.",
    empty: "References appear here after you submit a question.",
    reference: "Reference",
    topic: "Topic",
    match: "{percent}% match",
  },
  aiSetup: {
    title: "AI answers are off on this deployment",
    lead: "You are seeing compiled topic text only. Add {key} in Vercel to enable AI-assisted answers.",
  },
} as const;

type DeepString<T> = {
  readonly [K in keyof T]: T[K] extends readonly string[]
    ? readonly string[]
    : T[K] extends string
      ? string
      : DeepString<T[K]>;
};

export type Dictionary = DeepString<typeof en>;
