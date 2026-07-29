import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NotFoundPage } from "@/components/portfolio/NotFoundPage";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { defaultLocale } from "@/lib/i18n/types";
import "./[locale]/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
});

const copy = dictionaries[defaultLocale].notFound;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.body,
  robots: {
    index: false,
    follow: false,
  },
};

export default function GlobalNotFound(): React.ReactElement {
  return (
    <html
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
      lang="es"
    >
      <body className="min-h-full flex flex-col font-sans">
        <LanguageProvider initialLocale={defaultLocale}>
          <NotFoundPage />
        </LanguageProvider>
      </body>
    </html>
  );
}
