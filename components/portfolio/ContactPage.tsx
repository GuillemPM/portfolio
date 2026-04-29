"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PrimaryButton } from "./PortfolioHome";

const secondaryAction =
  "text-label-caps border border-white/10 px-8 py-4 text-on-surface-variant transition-colors duration-300 hover:border-on-tertiary-container/50 hover:text-white";

export function ContactPage() {
  const { messages: m } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
      <nav className="w-full border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-8xl items-center justify-between gap-4 px-8 py-6 md:px-16">
          <Link
            className="shrink-0 text-2xl font-black tracking-tighter text-white transition-opacity hover:opacity-90"
            href="/"
          >
            GP.
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-8xl grow flex-col justify-center px-8 py-24 md:px-16">
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
            <PrimaryButton href="/schedule">{m.contact.scheduleCta}</PrimaryButton>
          </section>

          <section className="border border-white/5 bg-surface-container-lowest/50 p-8">
            <h2 className="mb-4 text-2xl font-medium text-white">
              {m.contact.whatsappTitle}
            </h2>
            <p className="text-body-md mb-8 text-on-surface-variant">
              {m.contact.whatsappBody}
            </p>
            <PrimaryButton href="/chat">{m.contact.whatsappLink}</PrimaryButton>
          </section>
        </div>

        <div className="mt-12">
          <Link className={secondaryAction} href="/">
            {m.contact.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
