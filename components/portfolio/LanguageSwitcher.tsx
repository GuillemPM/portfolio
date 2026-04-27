"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { locales, type Locale } from "@/lib/i18n/types";

const labels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  ca: "CAT",
};

const base =
  "font-label min-w-[2.5rem] rounded px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-300";
const idle = "text-white/40 hover:text-blue-400";
const active = "text-blue-500";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

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
          onClick={() => setLocale(code)}
          lang={code === "ca" ? "ca" : code === "es" ? "es" : "en"}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
