import { PortfolioHome } from "@/components/portfolio/PortfolioHome";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
        <PortfolioHome />
      </div>
    </LanguageProvider>
  );
}
