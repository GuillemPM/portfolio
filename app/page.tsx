import { PortfolioHome } from "@/components/portfolio/PortfolioHome";
import { ConvaiWidget } from "@/components/portfolio/ConvaiWidget";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
        <PortfolioHome />
        <ConvaiWidget />
      </div>
    </LanguageProvider>
  );
}
