"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "./types";

export function getLocalizedPath(
  pathname: string | null,
  targetPath: string,
  targetLocale?: Locale
): string {
  const currentSegment = pathname?.split("/")[1];
  const currentLocale = locales.includes(currentSegment as Locale)
    ? currentSegment
    : "es";

  const localeToUse = targetLocale ?? currentLocale;

  if (localeToUse === "es") {
    return targetPath;
  }

  return `/${localeToUse}${targetPath}`;
}