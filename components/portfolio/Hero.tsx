"use client"

import { useLanguage } from "@/lib/i18n/LanguageProvider"
import { PrimaryButton } from "./PortfolioHome"
import { EffectScene } from "./effect-scene"

export function Hero() {
  const { messages: m } = useLanguage()
  return (
    <section className="relative z-0 mb-section-gap min-h-[720px] w-full overflow-hidden bg-primary-container sm:min-h-[760px] lg:min-h-[819px] xl:min-h-[860px]">
      <div
        className="pointer-events-none absolute -inset-x-[45%] bottom-0 top-[8%] z-0 min-h-0 sm:-inset-x-[24%] sm:top-0 md:-right-[22%] md:left-[26%] lg:-right-[14%] lg:left-[38%] xl:-right-[8%] xl:left-[44%]"
        aria-hidden
      >
        <EffectScene
          asciiCellSize={8}
          className="block h-full w-full min-h-0"
          enableZoom={false}
          transparentBackground
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] h-full min-h-0 w-full bg-gradient-to-b from-primary-container/95 via-primary-container/70 to-primary-container/30 sm:bg-gradient-to-r sm:from-primary-container sm:from-[18%] sm:via-primary-container/80 sm:to-primary-container/20 lg:via-primary-container/70 lg:to-primary-container/10"
      />
      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-8xl flex-col justify-center overflow-hidden px-8 sm:min-h-[760px] md:px-16 lg:min-h-[819px] xl:min-h-[860px]">
        <div className="relative z-10 grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-9 lg:col-start-2">
            <div className="mb-6 flex items-baseline gap-4 sm:mb-8">
              <div className="h-px w-12 shrink-0 self-center bg-on-tertiary-container" />
              <h1 className="m-0 text-2xl font-semibold leading-none tracking-tight text-white sm:text-3xl">
                {m.hero.name}
              </h1>
            </div>
            <p className="mb-8 max-w-[900px] text-headline-xl text-white leading-[0.95]">
              {m.hero.titleBefore}
              <span className="text-on-tertiary-container text-glow">
                {" "}
                {m.hero.titleHighlight}
              </span>
            </p>
            <p className="mb-12 max-w-[600px] text-body-lg text-on-surface-variant">
              {m.hero.body}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <PrimaryButton>{m.cta.hero}</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}