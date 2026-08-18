import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { LocaleProvider } from "@/lib/i18n/client";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return {
    title: {
      default: t.meta.title,
      template: t.meta.titleTemplate,
    },
    description: t.meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale} className={cn("h-full", poppins.variable, "font-sans", geist.variable)}>
      <body className="flex min-h-full flex-col bg-white font-sans text-creco-text antialiased">
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <AuthProvider>
            <SiteChrome>{children}</SiteChrome>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
