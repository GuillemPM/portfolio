import { ContactPage } from "@/components/portfolio/ContactPage";
import { ConvaiWidget } from "@/components/portfolio/ConvaiWidget";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { defaultLocale, type Locale } from "@/lib/i18n/types";

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