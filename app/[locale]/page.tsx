import { PortfolioHome } from "@/components/portfolio/PortfolioHome";
import { ConvaiWidget } from "@/components/portfolio/ConvaiWidget";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { defaultLocale, type Locale } from "@/lib/i18n/types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale: Locale = locale === "en" || locale === "ca" ? locale : defaultLocale;

  return (
    <LanguageProvider initialLocale={validLocale}>
      <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
        <PortfolioHome />
        <ConvaiWidget />
      </div>
    </LanguageProvider>
  );
}