"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getLocalizedPath } from "./getLocalizedPath";
import type { Locale } from "./types";

type LocalizedLinkProps = {
  href: string;
  locale?: Locale;
  className?: string;
  children: React.ReactNode;
};

export function LocalizedLink({
  href,
  locale,
  className,
  children,
}: LocalizedLinkProps) {
  const pathname = usePathname();
  const localizedHref = getLocalizedPath(pathname, href, locale);

  return (
    <Link href={localizedHref} className={className}>
      {children}
    </Link>
  );
}