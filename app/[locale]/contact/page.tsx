import type { Metadata } from "next";
import { ContactPage } from "@/components/portfolio/ContactPage";
import { ConvaiWidget } from "@/components/portfolio/ConvaiWidget";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { defaultLocale, type Locale } from "@/lib/i18n/types";

const HREFLANG_CONTACT = {
  es: "https://www.guillem.pm/contact",
  en: "https://www.guillem.pm/en/contact",
  ca: "https://www.guillem.pm/ca/contact",
} as const;

function resolveLocale(raw: string): Locale {
  if (raw === "en" || raw === "ca" || raw === "es") return raw;
  return defaultLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const canonical = HREFLANG_CONTACT[locale];

  return {
    alternates: {
      canonical,
      languages: {
        es: HREFLANG_CONTACT.es,
        en: HREFLANG_CONTACT.en,
        ca: HREFLANG_CONTACT.ca,
        "x-default": HREFLANG_CONTACT.es,
      },
    },
    openGraph: {
      url: canonical,
    },
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale: Locale = locale === "en" || locale === "ca" ? locale : defaultLocale;

  return (
    <LanguageProvider initialLocale={validLocale}>
      <ContactPage />
      <ConvaiWidget />
    </LanguageProvider>
  );
}