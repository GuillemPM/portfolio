"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedPath } from "@/lib/i18n/getLocalizedPath";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PrimaryButton } from "./PortfolioHome";

const secondaryAction =
  "text-label-caps border border-white/10 px-8 py-4 text-on-surface-variant transition-colors duration-300 hover:border-on-tertiary-container/50 hover:text-white";

const navLink =
  "font-label tracking-[0.2em] text-[10px] font-medium uppercase text-white/40 hover:text-blue-400 hover:border-blue-400/30 transition-all duration-500 scale-95 active:scale-90";
const navLinkActive =
  "font-label tracking-[0.2em] text-[10px] font-medium uppercase text-blue-500 border-b border-blue-500/50 pb-1 hover:text-blue-400 hover:border-blue-400/30 transition-all duration-500 scale-95 active:scale-90";

export function ContactPage() {
  const { messages: m } = useLanguage();
  const pathname = usePathname();

  const isContact = pathname.includes("/contact");

  return (
    <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-2xl transition-transform duration-300">
        <div className="mx-auto flex w-full max-w-8xl items-center justify-between gap-4 px-8 py-6 md:px-16">
          <Link
            className="shrink-0 text-2xl font-black tracking-tighter text-white transition-opacity hover:opacity-90"
            href={getLocalizedPath(pathname, "/")}
          >
            GP.
          </Link>
          <div className="hidden items-center gap-12 md:flex">
            <Link className={isContact ? navLink : navLinkActive} href={getLocalizedPath(pathname, "/")}>
              {m.nav.solutions}
            </Link>
            <Link className={isContact ? navLinkActive : navLink} href={getLocalizedPath(pathname, "/contact")}>
              {m.nav.contact}
            </Link>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <LanguageSwitcher />
            <Link
              className="whitespace-nowrap font-label text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 transition-all duration-500 hover:text-blue-400"
              href={getLocalizedPath(pathname, "/contact")}
            >
              {m.nav.startProject}
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-8xl grow flex-col justify-center px-8 py-24 md:px-16 pt-[120px]">
        <div className="max-w-3xl">
          <h1 className="text-headline-lg mb-8 text-white">
            {m.contact.title}
          </h1>
          <p className="text-body-lg max-w-2xl text-on-surface-variant">
            {m.contact.body}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <section className="border border-white/5 bg-surface-container-lowest/50 p-8">
            <h2 className="mb-4 text-2xl font-medium text-white">
              {m.contact.scheduleTitle}
            </h2>
            <p className="text-body-md mb-8 text-on-surface-variant">
              {m.contact.scheduleBody}
            </p>
            <PrimaryButton href="/schedule" external>{m.contact.scheduleCta}</PrimaryButton>
          </section>

          <section className="border border-white/5 bg-surface-container-lowest/50 p-8">
            <h2 className="mb-4 text-2xl font-medium text-white">
              {m.contact.whatsappTitle}
            </h2>
            <p className="text-body-md mb-8 text-on-surface-variant">
              {m.contact.whatsappBody}
            </p>
            <PrimaryButton href="/chat" external>{m.contact.whatsappLink}</PrimaryButton>
          </section>
        </div>

        <div className="mt-12">
          <Link className={secondaryAction} href={getLocalizedPath(pathname, "/")}>
            {m.contact.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
