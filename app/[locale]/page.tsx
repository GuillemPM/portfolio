import { PortfolioHome } from "@/components/portfolio/PortfolioHome";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { getAllPostMetas } from "@/lib/blog/posts";
import { defaultLocale, type Locale } from "@/lib/i18n/types";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  const validLocale: Locale = locale === "en" || locale === "ca" ? locale : defaultLocale;
  const latestPosts = getAllPostMetas(validLocale).slice(0, 3);

  return (
    <LanguageProvider initialLocale={validLocale}>
      <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
        <PortfolioHome latestPosts={latestPosts} />
      </div>
    </LanguageProvider>
  );
}