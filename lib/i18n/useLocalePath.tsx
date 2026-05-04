"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "./types";

export function useLocalePath() {
  const pathname = usePathname();

  const getLocalePath = (path: string, locale?: Locale): string => {
    if (!pathname) return path;
    const currentLocale = pathname.split("/")[1];
    const isValidLocale = locales.includes(currentLocale as Locale);

    if (!locale || locale === "es") {
      return isValidLocale ? path : `/${currentLocale}${path}`;
    }
    return `/${locale}${path}`;
  };

  return { getLocalePath, pathname };
}

type LocalizedLinkProps = {
  href: string;
  locale?: Locale;
  className?: string;
  children: React.ReactNode;
};

export function LocalizedLink({ href, locale, className, children }: LocalizedLinkProps) {
  const { getLocalePath } = useLocalePath();
  const localizedHref = getLocalePath(href, locale);

  return (
    <Link href={localizedHref} className={className}>
      {children}
    </Link>
  );
}