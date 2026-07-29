"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./types";

/** Full pathname per locale when the current page has locale-specific URLs (e.g. blog posts). */
export type LocaleHrefMap = Partial<Record<Locale, string>>;

const LocaleHrefContext = createContext<LocaleHrefMap | null>(null);

export function LocaleHrefProvider({
  hrefs,
  children,
}: {
  hrefs: LocaleHrefMap;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <LocaleHrefContext.Provider value={hrefs}>
      {children}
    </LocaleHrefContext.Provider>
  );
}

export function useLocaleHrefs(): LocaleHrefMap | null {
  return useContext(LocaleHrefContext);
}
