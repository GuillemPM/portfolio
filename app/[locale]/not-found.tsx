import { NotFoundPage } from "@/components/portfolio/NotFoundPage";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { defaultLocale } from "@/lib/i18n/types";

export default function LocaleNotFound(): React.ReactElement {
  return (
    <LanguageProvider initialLocale={defaultLocale}>
      <NotFoundPage />
    </LanguageProvider>
  );
}
