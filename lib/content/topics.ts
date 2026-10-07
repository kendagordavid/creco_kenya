export type TopicCopy = {
  title: string;
  tags: string[];
  lead?: string;
};

export const EN_TOPIC_COPY: Record<string, TopicCopy> = {
  "legal-framework": {
    title: "Understanding the Public Benefits Organizations Legal Framework in Kenya",
    tags: ["PBO Act", "PBO Regulations", "public benefit organization", "legal framework"],
  },
  registration: {
    title: "Registration of Public Benefit Organizations",
    tags: ["registration", "PBO Act", "name reservation", "public benefit test"],
  },
  bestowment: {
    title: "Bestowment of Public Benefit Organization Status",
    tags: ["bestowment", "PBO status", "existing organisations", "registration"],
  },
  "international-pbos": {
    title: "International Public Benefit Organizations and Exempt Organizations",
    tags: ["international PBO", "exemption", "registration", "work permits"],
  },
  "rights-and-benefits": {
    title: "Rights and Benefits of Registered Public Benefit Organizations",
    tags: ["rights", "benefits", "tax incentives", "donations"],
  },
  "governance-reporting-accountability": {
    title: "Governance, Reporting and Accountability",
    tags: ["governance", "reporting", "accountability", "annual returns"],
  },
  "suspension-cancellation-appeals": {
    title: "Suspension, Cancellation, Appeals and Restoration",
    tags: ["suspension", "cancellation", "appeals", "restoration"],
  },
  "self-regulation": {
    title: "Self-Regulation Forums and Federations",
    tags: ["self-regulation", "forums", "federations", "codes of conduct"],
  },
  "regulatory-authority-and-tribunal": {
    title:
      "The Public Benefits Organizations Regulatory Authority and the Public Benefit Organizations Disputes Tribunal",
    tags: ["PBORA", "regulatory authority", "disputes tribunal", "public register"],
  },
  "practical-compliance": {
    title: "Practical Guide to Compliance",
    tags: ["compliance", "forms", "fees", "timelines", "material changes"],
  },
};

export const SW_TOPIC_COPY: Record<string, TopicCopy> = {
  "legal-framework": {
    title: "Kuelewa mfumo wa kisheria wa Mashirika ya Manufaa ya Umma nchini Kenya",
    tags: ["Sheria ya PBO", "Kanuni za PBO", "shirika la manufaa ya umma", "mfumo wa kisheria"],
    lead:
      "Sheria ya Mashirika ya Manufaa ya Umma, 2013 ilibadilisha jinsi Kenya inavyodhibiti mashirika ya jamii: badala ya udhibiti mkali, mfumo unaoleta uwazi, uwajibikaji na ushirikiano na serikali.",
  },
  registration: {
    title: "Usajili wa Mashirika ya Manufaa ya Umma",
    tags: ["usajili", "Sheria ya PBO", "uhifadhi wa jina", "kipimo cha manufaa ya umma"],
    lead:
      "Usajili ni hatua ya kisheria ya kutambulisha shirika kama PBO chini ya Sheria ya PBO, na kuwezesha haki na ulinzi wa kisheria.",
  },
  bestowment: {
    title: "Kutunukiwa hadhi ya Shirika la Manufaa ya Umma",
    tags: ["kutunukiwa hadhi", "hadhi ya PBO", "mashirika yaliyopo", "usajili"],
    lead:
      "Mashirika yaliyosajiliwa chini ya sheria nyingine yanaweza kuomba kutunukiwa hadhi ya PBO bila kufuta usajili wao wa awali, iwapo wanakidhi masharti ya manufaa ya umma.",
  },
  "international-pbos": {
    title: "Mashirika ya Kimataifa ya Manufaa ya Umma na mashirika yaliyosamehewa",
    tags: ["PBO ya kimataifa", "kusamehewa", "usajili", "vibali vya kazi"],
    lead:
      "Mashirika ya kimataifa na yale yaliyosamehewa yanafuata njia maalum za usajili, uzingatiaji na vibali vya kazi chini ya Sheria ya PBO na Kanuni za 2026.",
  },
  "rights-and-benefits": {
    title: "Haki na manufaa ya Mashirika ya Manufaa ya Umma yaliyosajiliwa",
    tags: ["haki", "manufaa", "motisha za kodi", "michango"],
    lead:
      "Sheria inatambua mchango wa PBO na kuwapa haki za kisheria, ulinzi wa mali, na fursa za kushirikiana na serikali na wafadhili.",
  },
  "governance-reporting-accountability": {
    title: "Utawala, utoaji wa ripoti na uwajibikaji",
    tags: ["utawala", "utoaji wa ripoti", "uwajibikaji", "ripoti za mwaka"],
    lead:
      "PBO zinatakiwa kuwa na utawala bora, kuhifadhi rekodi, na kuwasilisha ripoti za mwaka ili kudumisha uaminifu wa umma na uzingatiaji wa sheria.",
  },
  "suspension-cancellation-appeals": {
    title: "Kusimamishwa, kufutwa, rufaa na kurejeshwa",
    tags: ["kusimamishwa", "kufutwa", "rufaa", "kurejeshwa"],
    lead:
      "Mamlaka inaweza kusimamisha au kufuta usajili pale ambapo shirika halizingatii sheria; shirika lina haki ya kukata rufaa na, katika hali fulani, kuomba kurejeshwa.",
  },
  "self-regulation": {
    title: "Vikao vya kujidhibiti na mashirikisho",
    tags: ["kujidhibiti", "vikao", "mashirikisho", "kanuni za maadili"],
    lead:
      "Vikao vya PBO vinaweza kujitambulisha kama mifumo ya kujidhibiti ili kuimarisha viwango vya maadili, uwazi na uwajibikaji ndani ya sekta.",
  },
  "regulatory-authority-and-tribunal": {
    title: "Mamlaka ya Kudhibiti Mashirika ya Manufaa ya Umma na Baraza la Migogoro",
    tags: ["PBORA", "mamlaka ya udhibiti", "baraza la migogoro", "sajili ya umma"],
    lead:
      "PBORA inasimamia usajili na uzingatiaji; Baraza la Migogoro la PBO linatatua mizozo kati ya mashirika na Mamlaka kwa njia ya kisheria.",
  },
  "practical-compliance": {
    title: "Mwongozo wa vitendo wa uzingatiaji",
    tags: ["uzingatiaji", "fomu", "ada", "muda", "mabadiliko muhimu"],
    lead:
      "Mwongozo huu unaeleza fomu, ada, muda wa maamuzi, mabadiliko muhimu na taratibu za kielektroniki za kuzingatia Sheria na Kanuni za PBO.",
  },
};
