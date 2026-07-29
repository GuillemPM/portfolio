"use client"

import { useEffect, useRef, type RefObject } from "react"
import { useLanguage } from "@/lib/i18n/LanguageProvider"
import { PrimaryButton } from "./PortfolioHome"
import { EffectScene } from "./effect-scene"
import type { OrbitSatelliteConfig } from "./hero-orbit-satellites"

const HERO_PAGE_BG = "#ffffff"
const SITE_NAV_HEIGHT_VAR = "--site-nav-height"

/** Lock hero height on touch devices so mobile browser chrome show/hide does not resize the canvas. */
function useStableHeroHeight(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const isTouchLayout = window.matchMedia("(hover: none), (pointer: coarse)").matches
    if (!isTouchLayout) return

    let lockedInnerHeight = window.innerHeight

    const applyHeight = (): void => {
      const navHeight =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue(SITE_NAV_HEIGHT_VAR)) ||
        72
      const px = lockedInnerHeight - navHeight
      section.style.height = `${px}px`
      section.style.minHeight = `${px}px`
    }

    applyHeight()

    const onOrientationChange = (): void => {
      window.setTimeout(() => {
        lockedInnerHeight = window.innerHeight
        applyHeight()
      }, 100)
    }

    window.addEventListener("orientationchange", onOrientationChange)
    return () => window.removeEventListener("orientationchange", onOrientationChange)
  }, [sectionRef])
}

const HERO_ORBIT_SATELLITES: OrbitSatelliteConfig[] = [
  { imageSrc: "/images/bc-mark.svg",             radius: 1.35, speed:  1,     phase: 0,      scale: 0.1, tiltX:  0.1,  trailColor: "#00b7c3" },
  { imageSrc: "/images/microsoft-foundry.webp",   radius: 1.5,  speed: -0.65, phase: 1.047, scale: 0.1, tiltX: -0.15, trailColor: "#6765d7" },
  { imageSrc: "/images/azure-color.webp",         radius: 1.3,  speed:  0.8,  phase: 2.094, scale: 0.1, tiltX:  0.2,  trailColor: "#0078d4" },
  { imageSrc: "/images/copilot-color.webp",       radius: 1.45, speed: -0.48, phase: 3.142, scale: 0.1, tiltX: -0.08, trailColor: "#dc79bf" },
  { imageSrc: "/images/azure-devops.webp",        radius: 1.3,  speed:  0.7,  phase: 4.189, scale: 0.1, tiltX:  0.12, trailColor: "#6397f3" },
  { imageSrc: "/images/supabase.webp",            radius: 1.4,  speed: -0.55, phase: 5.236, scale: 0.1, tiltX: -0.18, trailColor: "#3ecf8e" },
  { imageSrc: "/images/microsoft-color.webp",     radius: 1.5,  speed:  0.85, phase: 0.524, scale: 0.1, tiltX:  0.25, trailColor: "#ffc93b" },
  { imageSrc: "/images/claude.webp",              radius: 1.35, speed: -0.6,  phase: 1.571, scale: 0.1, tiltX: -0.32, trailColor: "#d97757" },
  { imageSrc: "/images/openai.webp",              radius: 1.45, speed:  0.75,  phase: 3.665, scale: 0.1, tiltX:  0.16, trailColor: "#9f9f9f" },
]

export function Hero() {
  const { messages: m } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  useStableHeroHeight(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="relative z-0 mb-section-gap flex h-below-nav min-h-below-nav w-full overflow-hidden bg-primary-container touch-pan-y"
    >
      <div
        className="absolute bottom-0 top-0 -inset-x-[45%] z-0 min-h-0 bg-primary-container sm:-inset-x-[24%] md:-right-[22%] md:left-[26%] lg:-right-[14%] lg:left-[38%] xl:-right-[8%] xl:left-[44%] max-md:[&_canvas]:pointer-events-none max-md:[&_canvas]:touch-pan-y"
        aria-hidden
      >
        <EffectScene
          asciiCellSize={8}
          className="block h-full w-full min-h-0"
          enableZoom={false}
          orbitSatellites={HERO_ORBIT_SATELLITES}
          pageBackgroundColor={HERO_PAGE_BG}
          transparentBackground
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] h-full min-h-0 w-full bg-gradient-to-b from-primary-container/95 via-primary-container/75 to-primary-container/40 sm:bg-gradient-to-r sm:from-primary-container sm:from-[18%] sm:via-primary-container/85 sm:to-primary-container/25 lg:via-primary-container/75 lg:to-primary-container/15"
      />
      <div className="pointer-events-none relative z-10 mx-auto flex h-full min-h-0 w-full max-w-8xl flex-col justify-start overflow-hidden px-8 pt-6 sm:pt-8 md:justify-center md:px-16 md:pt-0">
        <div className="relative z-10 grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-8 lg:col-start-2">
            <div className="mb-6 flex items-baseline gap-4 md:mb-8">
              <div className="h-px w-12 shrink-0 self-center bg-on-tertiary-container" />
              <h1 className="m-0 text-2xl font-semibold leading-none tracking-tight text-on-background sm:text-3xl">
                {m.hero.name}
              </h1>
            </div>
            <p className="mb-6 max-w-[720px] text-headline-xl text-on-background leading-[1.05]">
              {m.hero.headline}
            </p>
            <p className="mb-8 max-w-[600px] text-body-lg leading-relaxed text-on-surface-variant md:mb-12">
              {m.hero.subline}
            </p>
            <div className="pointer-events-auto flex flex-wrap items-center gap-6">
              <PrimaryButton href="/blog">{m.cta.hero}</PrimaryButton>
              <PrimaryButton href="/contact">{m.cta.contact}</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
