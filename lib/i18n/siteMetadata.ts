import { defaultLocale, type Locale } from "./types";

export const SITE_URL = "https://www.guillem.pm";
export const SITE_NAME = "Guillermo Padilla Martin";

export const siteTitle: Record<Locale, string> = {
  en: "Guillermo Padilla Martin | Software architect",
  es: "Guillermo Padilla Martin | Arquitecto de software",
  ca: "Guillermo Padilla Martin | Arquitecte de software",
};

export const siteDescription: Record<Locale, string> = {
  en: "Guillermo Padilla Martin writes about software architecture, Business Central, and building with AI. Blog and side projects.",
  es: "Guillermo Padilla Martin escribe sobre arquitectura de software, Business Central y desarrollo con IA. Blog y proyectos.",
  ca: "Guillermo Padilla Martin escriu sobre arquitectura de software, Business Central i desenvolupament amb IA. Blog i projectes.",
};

export const siteKeywords: Record<Locale, string[]> = {
  en: [
    "Guillermo Padilla Martin",
    "software architect",
    "Business Central",
    "Microsoft",
    "applied AI",
    "software architecture",
  ],
  es: [
    "Guillermo Padilla Martin",
    "arquitecto de software",
    "Business Central",
    "Microsoft",
    "IA aplicada",
    "arquitectura de software",
  ],
  ca: [
    "Guillermo Padilla Martin",
    "arquitecte de software",
    "Business Central",
    "Microsoft",
    "IA aplicada",
    "arquitectura de software",
  ],
};

export function resolveSiteLocale(raw: string): Locale {
  if (raw === "en" || raw === "ca" || raw === "es") return raw;
  return defaultLocale;
}

/** Absolute URL for a locale path (`""` or `"/"` = home). */
export function localizedUrl(locale: Locale, path = ""): string {
  const normalized =
    !path || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`;

  if (locale === "es") {
    return normalized ? `${SITE_URL}${normalized}` : SITE_URL;
  }
  return normalized ? `${SITE_URL}/${locale}${normalized}` : `${SITE_URL}/${locale}`;
}

export function languageAlternates(path = ""): Record<string, string> {
  return {
    es: localizedUrl("es", path),
    en: localizedUrl("en", path),
    ca: localizedUrl("ca", path),
    "x-default": localizedUrl("es", path),
  };
}

export function openGraphLocale(locale: Locale): string {
  return locale === "ca" ? "ca_ES" : locale === "en" ? "en_US" : "es_ES";
}

export function htmlLang(locale: Locale): string {
  return locale === "ca" ? "ca" : locale === "es" ? "es" : "en";
}
