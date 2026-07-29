import type { Metadata } from "next";
import { ContactPage } from "@/components/portfolio/ContactPage";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import {
  SITE_NAME,
  languageAlternates,
  localizedUrl,
  openGraphLocale,
  resolveSiteLocale,
} from "@/lib/i18n/siteMetadata";
import { locales, type Locale } from "@/lib/i18n/types";

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveSiteLocale(raw);
  const m = dictionaries[locale];
  const canonical = localizedUrl(locale, "/contact");
  const title = m.contact.title;
  const description = m.contact.body;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates("/contact"),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: openGraphLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale: Locale = resolveSiteLocale(locale);

  return (
    <LanguageProvider initialLocale={validLocale}>
      <ContactPage />
    </LanguageProvider>
  );
}
