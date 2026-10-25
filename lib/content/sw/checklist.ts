import type { ChecklistIntro, ChecklistSection, OrgStatus } from "@/lib/content/checklist";

const REGISTERED: OrgStatus[] = ["national", "ipbo"];
const EXEMPT_OR_BESTOWED: OrgStatus[] = ["exempt", "bestowed"];

export const CHECKLIST_INTRO: ChecklistIntro = {
  title: "Orodha ya tathmini binafsi ya utii wa kisheria wa PBO",
  legalBasis:
    "Msingi wa kisheria: Sheria ya Mashirika ya Manufaa ya Umma, 2013; Kanuni za Mashirika ya Manufaa ya Umma, 2026; na muhtasari wa kisheria wa PBO ulioidhinishwa.",
  purpose: [
    "Tathmini hii binafsi inasaidia mashirika kupima utii wao kwa masharti yanayohusika chini ya mfumo wa kisheria wa Mashirika ya Manufaa ya Umma.",
    "Si mbadala wa ushauri wa kisheria, ukaguzi, au uamuzi wa Mamlaka ya Udhibiti wa Mashirika ya Manufaa ya Umma (PBORA). Inasaidia mashirika kutambua nguvu, mapungufu, na maeneo yanayohitaji hatua za kurekebisha.",
  ],
  guidance:
    "Jibu kulingana na hali ya sasa ya shirika lako na kumbukumbu zake. Swali linapotaja kipindi cha ripoti, linamaanisha mwaka wa fedha wa shirika lako uliokamilika hivi karibuni.",
  statusQuestion: "Hali ya shirika ni ipi?",
  statusOptions: [
    { value: "national", label: "PBO ya Kitaifa" },
    { value: "ipbo", label: "PBO ya Kimataifa (IPBO)" },
    { value: "exempt", label: "IPBO Iliyosamehewa" },
    { value: "bestowed", label: "Shirika lililopewa hadhi ya PBO" },
  ],
};

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "general",
    title: "Sehemu B: Masharti ya jumla ya utii",
    description: "Inahusu PBO za Kitaifa na IPBO.",
    appliesTo: REGISTERED,
    questions: [
      {
        id: "b-1",
        group: "Utawala",
        label: "Je, shirika lina bodi ya uongozi inayosimamia shirika?",
      },
      {
        id: "b-2",
        group: "Utawala",
        label: "Je, majukumu ya bodi ya uongozi yameainishwa katika katiba ya shirika au hati nyingine ya uongozi?",
      },
      {
        id: "b-3",
        group: "Utawala",
        label: "Je, maamuzi ya bodi ya uongozi yanarekodiwa rasmi na kuhifadhiwa?",
        hint: "Mifano: kumbukumbu za mikutano; maazimio ya bodi; maamuzi ya kamati.",
      },
      {
        id: "b-4",
        group: "Lengo la manufaa ya umma",
        label: "Je, shirika linaendelea kufanya shughuli zinazounga mkono malengo yake ya manufaa ya umma?",
      },
      {
        id: "b-5",
        group: "Lengo la manufaa ya umma",
        label: "Je, fedha, mali na rasilimali za shirika zinatumika kuunga mkono malengo yake ya manufaa ya umma?",
      },
      {
        id: "b-6",
        group: "Uwajibikaji wa kifedha",
        label: "Je, shirika linatunza kumbukumbu za mapato, matumizi, mali na madeni?",
      },
      {
        id: "b-7",
        group: "Uwajibikaji wa kifedha",
        label:
          "Je, miamala ya kifedha inaungwa mkono na kumbukumbu kama ankara, risiti, hati za malipo, mikataba au taarifa za benki?",
      },
      {
        id: "b-8",
        group: "Uwajibikaji wa kifedha",
        label: "Je, shirika linaandaa taarifa za kifedha za kila mwaka?",
      },
    ],
  },
  {
    id: "national",
    title: "Sehemu C: PBO za Kitaifa zilizosajiliwa",
    appliesTo: ["national"],
    questions: [
      {
        id: "c-1",
        group: "Usajili",
        label:
          "Je, shirika limesajiliwa au kutambuliwa kisheria kama PBO chini ya Sheria ya PBO (cheti cha usajili kinapatikana)?",
      },
      {
        id: "c-2",
        group: "Muundo wa bodi ya uongozi",
        label: "Je, bodi ya uongozi ina angalau wanachama watano?",
      },
      {
        id: "c-3",
        group: "Muundo wa bodi ya uongozi",
        label: "Je, angalau wanachama watatu wa bodi ya uongozi hawana uhusiano wa kifamilia?",
      },
      {
        id: "c-4",
        group: "Ripoti ya mwaka",
        label: "Je, shirika liliwasilisha ripoti yake ya mwaka ndani ya miezi sita baada ya mwisho wa mwaka wake wa fedha?",
      },
      {
        id: "c-5",
        group: "Ripoti ya mwaka",
        label: "Je, taarifa za kifedha za mwaka za shirika zinakaguliwa na mkaguzi huru?",
      },
    ],
  },
  {
    id: "ipbo",
    title: "Sehemu D: PBO za Kimataifa zilizosajiliwa",
    appliesTo: ["ipbo"],
    questions: [
      {
        id: "d-1",
        group: "Usajili",
        label: "Je, shirika lina cheti halali cha usajili kama PBO ya Kimataifa?",
      },
      {
        id: "d-2",
        group: "Muundo wa bodi ya uongozi",
        label: "Je, angalau theluthi moja ya bodi ya uongozi ni raia wa Kenya wanaoishi Kenya?",
      },
      {
        id: "d-3",
        group: "Uwakilishi ulioidhinishwa",
        label: "Je, shirika limemteua na kumdumisha wakala aliyeidhinishwa nchini Kenya?",
      },
      {
        id: "d-4",
        group: "Ripoti ya mwaka",
        label: "Je, shirika liliwasilisha ripoti yake ya mwaka ndani ya miezi sita baada ya mwisho wa mwaka wake wa fedha?",
      },
      {
        id: "d-5",
        group: "Ripoti ya mwaka",
        label: "Je, taarifa za kifedha za mwaka za shirika zinakaguliwa na mkaguzi huru?",
      },
    ],
  },
  {
    id: "exempt",
    title: "Sehemu E: IPBO zilizosamehewa",
    appliesTo: ["exempt"],
    questions: [
      {
        id: "e-1",
        group: "Hali ya msamaha",
        label: "Je, shirika lina kibali halali cha msamaha kilichotolewa chini ya mfumo wa PBO?",
      },
      {
        id: "e-2",
        group: "Shughuli zinazohusika na msamaha",
        label: "Je, shughuli za shirika nchini Kenya zinaendana na msingi ambao msamaha ulitolewa?",
        hint:
          "Mifano inaweza kujumuisha: utoaji wa ruzuku; msaada wa kiufundi; kujenga uwezo; utafiti; msaada wa sera; ushirikiano na washirika wa ndani.",
      },
      {
        id: "e-3",
        group: "Masharti ya msamaha",
        label: "Je, shirika linaendelea kutii masharti yote yaliyoambatanishwa na msamaha wake?",
        hint:
          "Mifano inaweza kujumuisha: kudumisha uwakilishi unaohitajika nchini Kenya; kufanya shughuli zinazoruhusiwa tu; kutii masharti yoyote ya ripoti au taarifa yaliyoambatanishwa na msamaha.",
      },
    ],
  },
  {
    id: "bestowed",
    title: "Sehemu F: Mashirika yaliyopewa hadhi ya PBO",
    appliesTo: ["bestowed"],
    questions: [
      {
        id: "f-1",
        group: "Kuendelea kustahiki",
        label:
          "Je, shirika bado limesajiliwa au kuanzishwa kisheria chini ya sheria ambayo kupitia kwayo lilipata hadhi yake ya kisheria awali?",
      },
      {
        id: "f-2",
        group: "Kuendelea kustahiki",
        label:
          "Je, usajili, leseni, hati au hadhi ya kisheria ya shirika imebaki halali bila kusimamishwa, kufutwa au kizuizi kingine cha udhibiti katika kipindi cha ripoti?",
      },
      {
        id: "f-3",
        group: "Kuendelea kustahiki",
        label:
          "Je, shirika linaendelea kufanya shughuli za manufaa ya umma zinazoendana na malengo ambayo hadhi ya PBO ilitolewa?",
      },
    ],
  },
  {
    id: "material-changes",
    title: "Sehemu G: Mabadiliko muhimu",
    description:
      "Inapima kama shirika limeripoti mabadiliko muhimu kwa PBORA kwa mujibu wa masharti yanayohusika.",
    questions: [
      {
        id: "g-1",
        group: "Mabadiliko ya bodi ya uongozi",
        appliesTo: REGISTERED,
        kind: "trigger",
        label: "Je, shirika lilibadilisha mwanachama yeyote wa bodi yake ya uongozi katika kipindi cha ripoti?",
        followUps: [
          { id: "g-1a", label: "Je, shirika liliiarifu PBORA ndani ya siku 30 baada ya mabadiliko?" },
        ],
      },
      {
        id: "g-2",
        group: "Mabadiliko ya katiba",
        appliesTo: REGISTERED,
        kind: "trigger",
        label: "Je, shirika lilirekebisha katiba yake au hati nyingine ya uongozi katika kipindi cha ripoti?",
        followUps: [
          { id: "g-2a", label: "Je, shirika liliiarifu PBORA ndani ya siku 60 baada ya marekebisho?" },
        ],
      },
      {
        id: "g-3",
        group: "Mabadiliko ya jina",
        kind: "trigger",
        label: "Je, shirika lilianzisha mabadiliko ya jina lake lililosajiliwa katika kipindi cha ripoti?",
        followUps: [
          {
            id: "g-3a",
            appliesTo: REGISTERED,
            label:
              "Je, shirika liliwasilisha Fomu 15 na nyaraka zinazohitajika kwa PBORA na kupata idhini ya mabadiliko ya jina?",
          },
          {
            id: "g-3b",
            appliesTo: EXEMPT_OR_BESTOWED,
            label:
              "Je, shirika lilipata idhini kutoka kwa mdhibiti wake mkuu na kuiarifu PBORA ndani ya siku 30 baada ya kupokea idhini hiyo?",
          },
        ],
      },
      {
        id: "g-4",
        group: "Mabadiliko ya anwani",
        appliesTo: REGISTERED,
        kind: "trigger",
        label:
          "Je, shirika lilibadilisha anwani yake ya mahali, anwani ya posta au mahali pakuu pa shughuli katika kipindi cha ripoti?",
        followUps: [
          { id: "g-4a", label: "Je, shirika liliiarifu PBORA ndani ya siku 60 baada ya mabadiliko?" },
        ],
      },
      {
        id: "g-5",
        group: "Mipango ya kibenki",
        appliesTo: REGISTERED,
        kind: "trigger",
        label: "Je, shirika lilibadilisha mipango yake ya kibenki katika kipindi cha ripoti?",
        followUps: [
          { id: "g-5a", label: "Je, shirika liliiarifu PBORA ndani ya siku 60 baada ya mabadiliko?" },
        ],
      },
      {
        id: "g-6",
        group: "Mabadiliko ya wakala aliyeidhinishwa",
        appliesTo: ["ipbo"],
        kind: "trigger",
        label: "Je, shirika lilibadilisha wakala wake aliyeidhinishwa katika kipindi cha ripoti?",
        followUps: [
          { id: "g-6a", label: "Je, shirika liliiarifu PBORA kuhusu mabadiliko kwa kutumia utaratibu unaohusika?" },
        ],
      },
      {
        id: "g-7",
        group: "Mabadiliko mengine muhimu",
        appliesTo: EXEMPT_OR_BESTOWED,
        kind: "trigger",
        label:
          "Je, shirika lilifanya mabadiliko yoyote kwa bodi yake ya uongozi, katiba, anwani, mipango ya kibenki au maelezo mengine yaliyosajiliwa katika kipindi cha ripoti?",
        followUps: [
          { id: "g-7a", label: "Je, shirika lilipata idhini kutoka kwa mdhibiti wake mkuu kabla ya kufanya mabadiliko?" },
          { id: "g-7b", label: "Je, shirika liliiarifu PBORA ndani ya siku 30 baada ya kupokea idhini hiyo?" },
        ],
      },
    ],
  },
  {
    id: "income",
    title: "Sehemu H: Shughuli za kuzalisha mapato",
    description: "Inahusu PBO za Kitaifa na IPBO.",
    appliesTo: REGISTERED,
    questions: [
      {
        id: "h-1",
        kind: "trigger",
        label: "Je, shirika lilifanya shughuli za kuzalisha mapato katika kipindi cha ripoti?",
        followUps: [
          {
            id: "h-1a",
            label: "Je, shughuli za kuzalisha mapato zilienda sambamba na malengo ya manufaa ya umma ya shirika?",
          },
          {
            id: "h-1b",
            label: "Je, shirika lilipata leseni, vibali au idhini zozote zinazohitajika kwa shughuli hizi?",
          },
          {
            id: "h-1c",
            label: "Je, mapato kutoka kwa shughuli hizo yalitumika kuunga mkono malengo ya manufaa ya umma ya shirika?",
          },
          {
            id: "h-1d",
            label: "Je, shirika linatunza kumbukumbu za mapato na matumizi yanayohusiana na shughuli hizo?",
          },
        ],
      },
    ],
  },
  {
    id: "regulatory",
    title: "Sehemu I: Hatua za udhibiti",
    questions: [
      {
        id: "i-1",
        kind: "trigger",
        label:
          "Je, shirika lilipokea notisi rasmi ya utii, agizo, uamuzi wa kusimamishwa au kufutwa kutoka PBORA katika kipindi cha ripoti?",
        followUps: [
          {
            id: "i-1a",
            label: "Je, shirika limekamilisha hatua zinazohitajika chini ya notisi, agizo au uamuzi huo?",
          },
        ],
      },
    ],
  },
];

export const CHECKLIST_STORAGE_KEY = "creco-checklist-progress";
