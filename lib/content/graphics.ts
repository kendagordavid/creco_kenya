export type CrecoGraphic = {
  src: string;
  alt: string;
  title: string;
};

export const CRECO_GRAPHICS = {
  definingPbo: {
    src: "/images/graphics/defining-a-pbo.jpg",
    title: "Defining a PBO",
    alt: "Infographic defining a PBO as voluntary, autonomous, not for profit, and for public benefit.",
  },
  publicBenefit: {
    src: "/images/graphics/public-benefit.png",
    title: "What counts as public benefit",
    alt: "Infographic of illustrative public benefit areas from the Sixth Schedule.",
  },
  notAPbo: {
    src: "/images/graphics/not-a-pbo.jpg",
    title: "What is not a PBO",
    alt: "Infographic listing organisations that are not considered PBOs, including trade unions, political parties, churches, societies, cooperatives, SACCOs, and microfinance institutions.",
  },
  difference: {
    src: "/images/graphics/cso-pbo-npo.png",
    title: "CSO, PBO, and NPO",
    alt: "Infographic explaining the difference between a CSO, a PBO, and an NPO.",
  },
  howToRegister: {
    src: "/images/graphics/how-to-register.png",
    title: "How to register a PBO",
    alt: "Infographic of four registration steps: reserve a name, pass the public benefit test, draft a constitution, and submit Form 1 with documents.",
  },
  pathways: {
    src: "/images/graphics/registration-pathways.jpg",
    title: "PBO registration pathways",
    alt: "Infographic comparing registration of a new PBO with bestowment of PBO status on an existing organisation.",
  },
  basics: {
    src: "/images/graphics/basics-101.png",
    title: "PBO basics",
    alt: "Infographic of basic registration rules: governing body size, unrelated members, and a 60-day name reservation.",
  },
  myths: {
    src: "/images/graphics/registration-myths.png",
    title: "Myths about registration",
    alt: "Infographic correcting three myths about tax exemption, government control, and guaranteed donor funding.",
  },
  bestowment: {
    src: "/images/graphics/bestowment-true-false.png",
    title: "Bestowment: true or false",
    alt: "Infographic correcting three false claims about bestowment and companies limited by guarantee.",
  },
  international: {
    src: "/images/graphics/international-pbos.jpg",
    title: "International PBOs",
    alt: "Infographic explaining when an international organisation registers as an international PBO or applies for an exemption permit.",
  },
  actVsRegulations: {
    src: "/images/graphics/act-vs-regulations.png",
    title: "The Act and the Regulations",
    alt: "Infographic comparing the PBO Act, 2013 with the PBO Regulations, 2026.",
  },
  timelines: {
    src: "/images/graphics/notification-timelines.png",
    title: "PBORA notification timelines",
    alt: "Infographic of the 30-day and 60-day deadlines for notifying PBORA when organisation details change.",
  },
  lifeCycle: {
    src: "/images/graphics/life-cycle.png",
    title: "The life of a PBO",
    alt: "Infographic of a PBO life cycle from registration through operation, suspension, cancellation, dissolution, and restoration.",
  },
  synergy: {
    src: "/images/graphics/synergy-building.jpg",
    title: "PBO synergy building",
    alt: "Infographic showing one PBO, a forum of at least 10 PBOs, and a federation of at least 5 forums.",
  },
  liability: {
    src: "/images/graphics/liability.png",
    title: "Liability of governing-body members",
    alt: "Infographic explaining that governing-body members are not personally liable for acts done in good faith, and that this is not blanket immunity.",
  },
} as const satisfies Record<string, CrecoGraphic>;

const g = CRECO_GRAPHICS;

export const TOPIC_GRAPHICS: Record<string, readonly CrecoGraphic[]> = {
  "what-is-a-pbo": [g.definingPbo, g.publicBenefit, g.notAPbo, g.difference],
  "registration-requirements": [g.basics, g.myths],
  "registration-process-and-timeline": [g.howToRegister, g.pathways, g.international],
  "objects-and-purpose-of-the-act": [g.lifeCycle, g.synergy],
  "pbo-regulations-overview": [g.actVsRegulations, g.timelines],
  "pbo-regulatory-authority": [g.liability],
};

export const ALL_CRECO_GRAPHICS: readonly CrecoGraphic[] = Object.values(CRECO_GRAPHICS);
