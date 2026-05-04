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
import { dictionaries } from "./dictionaries";
import { defaultLocale, locales, type Locale, type Messages } from "./types";

const STORAGE_KEY = "portfolio-locale";

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw && (locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return null;
}

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
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? defaultLocale
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    const segment = path.split("/")[1];
    const urlLocale = locales.includes(segment as Locale)
      ? (segment as Locale)
      : null;
    if (urlLocale && urlLocale !== locale) {
      setLocaleState(urlLocale);
    }
  }, []);

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
