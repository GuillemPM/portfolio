"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedPath } from "@/lib/i18n/getLocalizedPath";
import { usePathname } from "next/navigation";
import { PrimaryButton } from "./PortfolioHome";
import { SiteNav } from "./SiteNav";

export function ContactPage(): React.ReactElement {
  const { messages: m } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
      <SiteNav m={m} />

      <main className="mx-auto flex w-full max-w-8xl grow flex-col justify-center px-8 pb-24 pt-site-nav-content md:px-16">
        <div className="max-w-3xl">
          <h1 className="text-headline-lg mb-8 text-on-background">{m.contact.title}</h1>
          <p className="text-body-lg max-w-2xl text-on-surface-variant">{m.contact.body}</p>
        </div>

        <section className="mt-16 max-w-xl border border-subtle bg-primary-container p-8">
          <h2 className="mb-4 text-2xl font-medium text-on-background">{m.contact.linkedInTitle}</h2>
          <p className="text-body-md mb-8 text-on-surface-variant">{m.contact.linkedInBody}</p>
          <PrimaryButton href="https://www.linkedin.com/in/gpadillam" external>
            {m.contact.linkedInCta}
          </PrimaryButton>
        </section>

        <p className="text-body-md mt-12 text-on-surface-variant">
          <Link
            className="text-on-tertiary-container transition-colors duration-300 hover:text-on-background"
            href={getLocalizedPath(pathname, "/")}
          >
            {m.contact.backHome}
          </Link>
        </p>
      </main>
    </div>
  );
}
