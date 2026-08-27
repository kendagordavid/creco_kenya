/** Canonical PBO source documents served from /public/documents. */
export type PlatformDocument = {
  id: string;
  title: string;
  url: string;
  type: "legislation" | "regulations";
  filename: string;
};

export const PLATFORM_DOCUMENTS: PlatformDocument[] = [
  {
    id: "pbo-act-2013",
    title: "Public Benefit Organizations Act, 2013 (No. 18 of 2013)",
    url: "/documents/pbo-act-2013.pdf",
    type: "legislation",
    filename: "pbo-act-2013.pdf",
  },
  {
    id: "pbo-regulations-2026",
    title: "Public Benefit Organizations Regulations, 2026 (Legal Notice No. 43)",
    url: "/documents/pbo-regulations-2026.pdf",
    type: "regulations",
    filename: "pbo-regulations-2026.pdf",
  },
];

export function getPlatformDocument(id: string): PlatformDocument | undefined {
  return PLATFORM_DOCUMENTS.find((doc) => doc.id === id);
}
