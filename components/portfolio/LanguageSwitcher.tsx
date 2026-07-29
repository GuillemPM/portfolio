"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useLocaleHrefs } from "@/lib/i18n/LocaleHrefContext";
import { locales, type Locale } from "@/lib/i18n/types";

const labels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  ca: "CAT",
};

const base =
  "font-label min-w-[2.5rem] rounded px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-300";
const idle = "text-on-surface-variant hover:text-blue-600";
const active = "text-blue-600";

function defaultPathForLocale(pathname: string, code: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const restSegments =
    first && (locales as readonly string[]).includes(first)
      ? segments.slice(1)
      : segments;
  const suffix = restSegments.length ? `/${restSegments.join("/")}` : "";

  if (code === "es") {
    return suffix || "/";
  }
  return `/${code}${suffix}`;
}

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLanguage();
  const localeHrefs = useLocaleHrefs();

  const handleLocaleChange = (code: Locale) => {
    const href = localeHrefs?.[code] ?? defaultPathForLocale(pathname, code);
    router.push(href);
  };

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="Language"
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className={`${base} ${locale === code ? active : idle}`}
          onClick={() => handleLocaleChange(code)}
          lang={code === "ca" ? "ca" : code === "es" ? "es" : "en"}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
