import type { Metadata } from "next";
import { DM_Sans, Literata } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CRECO PBO Act Platform",
    template: "%s | CRECO PBO Act Platform",
  },
  description:
    "Civic access and guidance on Kenya's Public Benefit Organizations Act, 2013 — for PBOs, community organisations, and partners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${literata.variable} ${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white text-creco-text antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
