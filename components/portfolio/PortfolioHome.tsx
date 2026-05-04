"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedPath } from "@/lib/i18n/getLocalizedPath";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Hero } from "./Hero";
import { EffectScene } from "./effect-scene";
import type { Messages } from "@/lib/i18n/types";

const navLink =
  "font-label tracking-[0.2em] text-[10px] font-medium uppercase text-white/40 hover:text-blue-400 hover:border-blue-400/30 transition-all duration-500 scale-95 active:scale-90";
const navLinkActive =
  "font-label tracking-[0.2em] text-[10px] font-medium uppercase text-blue-500 border-b border-blue-500/50 pb-1 hover:text-blue-400 hover:border-blue-400/30 transition-all duration-500 scale-95 active:scale-90";

export const primaryButtonClass =
  "relative inline-flex overflow-hidden border border-on-tertiary-container/30 bg-transparent px-8 py-4 text-label-caps uppercase text-white transition-all duration-300 hover:border-on-tertiary-container hover:shadow-[0_0_15px_rgba(72,108,255,0.4)] group";

export function PrimaryButton({
  children,
  href,
  external,
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
}) {
  const pathname = usePathname();
  const localizedHref = getLocalizedPath(pathname, href);

  return (
    <Link
      href={localizedHref}
      className={primaryButtonClass}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-on-tertiary-container/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
    </Link>
  );
}

const solutionMeta = [
  {
    id: "custom" as const,
    modelSrc: "/models/wbJEv2ak.glb",
    modelScale: 2,
    asciiCellSize: 1,
    modelRotation: [0, -4, 0] as [number, number, number],
  },
  {
    id: "ai" as const,
    modelSrc: "/models/l0OhU-01.glb",
    modelScale: 1.7,
    asciiCellSize: 1,
    modelRotation: [0, -0.5, 0] as [number, number, number],
    modelPosition: [0, -0.5, 0] as [number, number, number],
  },
  {
    id: "web" as const,
    modelSrc: "/models/ZdK4WKbz.glb",
    modelScale: 0.5,
    asciiCellSize: 1,
    float: true,
    modelRotation: [-0.15, -1.8, -0.25] as [number, number, number],
  },
  {
    id: "data" as const,
    modelSrc: "/models/7KxckLro.glb",
    modelScale: 1,
    asciiCellSize: 1,
    float: true,
    modelRotation: [0, -0.5, 0] as [number, number, number],
    modelPosition: [0, -0.3, -1] as [number, number, number],
  },
] as const;

type SolutionId = (typeof solutionMeta)[number]["id"];

function solutionCopy(m: Messages, id: SolutionId) {
  return m.solutions.cards[id];
}

function PortfolioNav({ m }: { m: Messages }) {
  const pathname = usePathname();

  const isContact = pathname.includes("/contact");

  return (
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
  );
}

export function PortfolioHome() {
  const { messages: m } = useLanguage();
  const pathname = usePathname();

  return (
    <>
      <PortfolioNav m={m} />
      <main className="min-h-0 grow pt-[120px]">
        <Hero />

        <section
          className="mx-auto mb-section-gap max-w-8xl px-8 md:px-16"
          id="solutions"
        >
          <div className="mb-16">
            <h2 className="text-headline-lg text-white">{m.solutions.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {solutionMeta.map((card) => {
              const copy = solutionCopy(m, card.id);
              return (
                <div
                  className="relative flex h-full min-h-[11rem] flex-col border border-white/5 bg-surface-container-lowest/50 p-8 transition-colors duration-300 hover:bg-surface-container-low"
                  key={card.id}
                >
                  <div className="pointer-events-none absolute right-3 top-3 z-10 h-[5.5rem] w-[5.5rem] sm:right-4 sm:top-4 sm:h-24 sm:w-24">
                    <EffectScene
                      embed
                      transparentBackground
                      modelSrc={card.modelSrc}
                      modelScale={card.modelScale}
                      modelPosition={
                        "modelPosition" in card ? card.modelPosition : undefined
                      }
                      modelRotation={card.modelRotation}
                      float={"float" in card ? card.float : undefined}
                      asciiCellSize={card.asciiCellSize}
                      enableZoom={false}
                      className="h-full w-full min-h-0"
                    />
                  </div>
                  <div className="min-h-0 flex-1" aria-hidden />
                  <div>
                    <h3 className="mb-3 pr-[5.5rem] text-xl font-medium text-white sm:pr-28">
                      {copy.title}
                    </h3>
                    <p className="text-body-md pr-[5.5rem] text-sm text-on-surface-variant/70 sm:pr-28">
                      {copy.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          className="mx-auto mb-section-gap max-w-8xl px-8 md:px-16"
          id="target"
        >
          <div className="grid grid-cols-12 gap-gutter">
            <div className="mb-12 col-span-12 lg:col-span-5 lg:mb-0">
              <h2 className="mb-6 text-headline-lg text-white">
                {m.target.title}
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                {m.target.subtitle}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <ul className="flex flex-col gap-6">
                {m.target.sectors.map((item, i) => (
                  <li
                    className="text-body-lg border-b border-white/5 pb-4 text-2xl text-white"
                    key={i}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="relative mx-auto mb-section-gap max-w-8xl px-8 md:px-16"
          id="results"
        >
          <div className="mb-16 text-center">
            <h2 className="text-headline-lg text-white">{m.results.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {m.results.items.map((title, i) => (
              <div
                className="border-t border-on-tertiary-container/30 bg-gradient-to-b from-white/[0.02] to-transparent px-6 py-12 text-center"
                key={i}
              >
                <h3 className="mb-4 text-2xl text-white text-headline-lg">
                  {title}
                </h3>
                <div className="mx-auto h-0.5 w-12 bg-on-tertiary-container" />
              </div>
            ))}
          </div>
        </section>

        <section
          className="mx-auto mb-section-gap max-w-8xl px-8 md:px-16"
          id="process"
        >
          <div className="mb-16">
            <h2 className="text-headline-lg text-white">{m.process.title}</h2>
          </div>
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="absolute bottom-6 left-1/2 top-6 z-0 w-px -translate-x-1/2 bg-white/10 md:hidden" />
            <div className="absolute left-[calc(16.666667%+1.5rem)] right-[calc(16.666667%+1.5rem)] top-6 z-0 hidden h-px bg-white/10 md:block" />
            {m.process.steps.map((title, i) => (
              <div className="relative z-10" key={i}>
                <div className="text-label-caps mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-on-tertiary-container bg-surface-container text-lg text-on-tertiary-container">
                  {i + 1}
                </div>
                <h3 className="text-body-lg text-center text-xl font-medium text-white">
                  {title}
                </h3>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <div className="inline-block">
              <PrimaryButton href="/contact">{m.cta.process}</PrimaryButton>
            </div>
          </div>
        </section>

        <section
          className="mx-auto mb-section-gap max-w-8xl px-8 md:px-16"
          id="why-me"
        >
          <div className="grid grid-cols-12 gap-gutter">
            <div className="mb-12 col-span-12 lg:col-span-4 lg:mb-0">
              <h2 className="mb-6 text-headline-lg text-white">{m.why.title}</h2>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <ul className="flex flex-col gap-6 text-body-lg text-on-surface-variant">
                {m.why.items.map((item, i) => (
                  <li className="flex items-start gap-4" key={i}>
                    <span className="material-symbols-outlined text-on-tertiary-container">
                      done
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="mx-auto mb-section-gap max-w-8xl border-t border-white/5 px-8 pb-8 pt-32 md:px-16"
          id="contact"
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="text-headline-lg mb-8 max-w-3xl text-white">
              {m.contact.title}
            </h2>
            <p className="text-body-lg mb-12 max-w-2xl text-on-surface-variant">
              {m.contact.body}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <PrimaryButton href="/contact">{m.cta.contact}</PrimaryButton>
            </div>
            <p className="mt-8 text-body-md text-on-surface-variant">
              {m.contact.whatsappPrefix}{" "}
              <a
                className="text-on-tertiary-container transition-colors duration-300 hover:text-white"
                href="/chat"
                rel="noopener noreferrer"
                target="_blank"
              >
                {m.contact.whatsappLink}
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-32 w-full border-t border-white/5 bg-[#0A0A0B]">
        <div className="mx-auto flex max-w-8xl flex-col items-end justify-between gap-8 px-8 py-24 md:flex-row md:px-16">
          <div className="flex flex-col gap-4">
            <div className="text-4xl font-black tracking-tighter text-white/10">
              GP.
            </div>
            <div className="text-[9px] font-sans uppercase tracking-widest text-white/30">
              {m.footer.line}
            </div>
          </div>
          <div className="flex gap-8">
            <a
              className="text-[9px] font-sans uppercase tracking-widest text-white/30 opacity-100 transition-colors duration-300 hover:text-blue-500 hover:opacity-80"
              href="https://www.linkedin.com/gpadillam"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              className="text-[9px] font-sans uppercase tracking-widest text-white/30 opacity-100 transition-colors duration-300 hover:text-blue-500 hover:opacity-80"
              href="https://github.com/GuillemPM"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}