"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getLocalizedPath } from "@/lib/i18n/getLocalizedPath";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Messages } from "@/lib/i18n/types";

const SITE_NAV_HEIGHT_VAR = "--site-nav-height";

const navLink =
  "font-label tracking-[0.2em] text-[10px] font-medium uppercase text-on-surface-variant hover:text-blue-600 hover:border-blue-400/30 transition-all duration-500 scale-95 active:scale-90";
const navLinkActive =
  "font-label tracking-[0.2em] text-[10px] font-medium uppercase text-blue-600 border-b border-blue-500/40 pb-1 hover:text-blue-600 hover:border-blue-400/30 transition-all duration-500 scale-95 active:scale-90";

type NavKey = "about" | "blog" | "contact";

function navActive(pathname: string, key: NavKey): boolean {
  const localized = pathname.replace(/^\/(en|ca)/, "") || "/";
  if (key === "about") {
    return localized === "/" || localized === "";
  }
  if (key === "blog") {
    return localized.startsWith("/blog");
  }
  return localized.startsWith("/contact");
}

export function SiteNav({ m }: { m: Messages }): React.ReactElement {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const syncHeight = (): void => {
      document.documentElement.style.setProperty(SITE_NAV_HEIGHT_VAR, `${nav.offsetHeight}px`);
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 z-50 w-full border-b border-subtle bg-primary-container/85 backdrop-blur-2xl transition-transform duration-300"
    >
      <div className="mx-auto flex w-full max-w-8xl items-center justify-between gap-4 px-8 py-6 md:px-16">
        <Link
          className="shrink-0 text-2xl font-black tracking-tighter text-on-background transition-opacity hover:opacity-80"
          href={getLocalizedPath(pathname, "/")}
        >
          GP.
        </Link>
        <div className="hidden items-center gap-12 md:flex">
          <Link
            className={navActive(pathname, "about") ? navLinkActive : navLink}
            href={getLocalizedPath(pathname, "/")}
          >
            {m.nav.about}
          </Link>
          <Link
            className={navActive(pathname, "blog") ? navLinkActive : navLink}
            href={getLocalizedPath(pathname, "/blog")}
          >
            {m.nav.blog}
          </Link>
          <Link
            className={navActive(pathname, "contact") ? navLinkActive : navLink}
            href={getLocalizedPath(pathname, "/contact")}
          >
            {m.nav.contact}
          </Link>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <LanguageSwitcher />
          <Link
            className="whitespace-nowrap font-label text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface-variant transition-all duration-500 hover:text-blue-600"
            href={getLocalizedPath(pathname, "/contact")}
          >
            {m.nav.connect}
          </Link>
        </div>
      </div>
    </nav>
  );
}
