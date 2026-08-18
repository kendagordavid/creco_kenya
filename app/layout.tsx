import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import { auth } from "@/auth";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
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
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const session = await auth();

  return (
    <html lang={locale} suppressHydrationWarning className={cn("h-full", poppins.variable, "font-sans", geist.variable)}>
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased"
      >
        <ThemeProvider>
          <LocaleProvider locale={locale} dictionary={dictionary}>
            <AuthProvider session={session}>
              <SiteChrome>{children}</SiteChrome>
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
