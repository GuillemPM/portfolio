import { ContactPage } from "@/components/portfolio/ContactPage";
import { ConvaiWidget } from "@/components/portfolio/ConvaiWidget";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

export default function Contact() {
  return (
    <LanguageProvider>
      <ContactPage />
      <ConvaiWidget />
    </LanguageProvider>
  );
}
