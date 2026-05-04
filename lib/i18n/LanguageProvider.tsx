"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { dictionaries } from "./dictionaries";
import { defaultLocale, locales, type Locale, type Messages } from "./types";

const STORAGE_KEY = "portfolio-locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  messages: Messages;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? defaultLocale
  );

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0];
    const urlLocale: Locale =
      first && (locales as readonly string[]).includes(first)
        ? (first as Locale)
        : defaultLocale;
    if (urlLocale !== locale) {
      queueMicrotask(() => {
        setLocaleState(urlLocale);
      });
    }
  }, [pathname, locale]);

  useEffect(() => {
    document.documentElement.lang =
      locale === "ca" ? "ca" : locale === "es" ? "es" : "en";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      messages: dictionaries[locale],
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
