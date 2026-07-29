"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedPath } from "@/lib/i18n/getLocalizedPath";
import { PrimaryButton } from "./PortfolioHome";
import { SiteNav } from "./SiteNav";

export function NotFoundPage(): React.ReactElement {
  const { messages: m } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
      <SiteNav m={m} />

      <main className="mx-auto flex w-full max-w-8xl grow flex-col justify-center px-8 pb-24 pt-site-nav-content md:px-16">
        <p className="text-label-caps mb-6 text-[10px] text-on-tertiary-container">
          {m.notFound.code}
        </p>
        <h1 className="text-headline-lg mb-8 max-w-3xl text-on-background">
          {m.notFound.title}
        </h1>
        <p className="text-body-lg mb-12 max-w-2xl text-on-surface-variant">
          {m.notFound.body}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <PrimaryButton href={getLocalizedPath(pathname, "/")}>
            {m.notFound.backHome}
          </PrimaryButton>
          <PrimaryButton href={getLocalizedPath(pathname, "/blog")}>
            {m.notFound.viewBlog}
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
