"use client";

import dynamic from "next/dynamic";

const EffectScene = dynamic(
  () => import("./effect-scene").then((m) => m.EffectScene),
  { ssr: false, loading: () => null }
);

/** Hero: same as upstream demo, no scroll-wheel zoom on the canvas. */
export function HeroAsciiBackgroundLazy({
  className,
  modelSrc,
  asciiCellSize,
}: {
  className?: string
  modelSrc?: string
  asciiCellSize?: number
}) {
  return (
    <EffectScene
      className={className}
      enableZoom={false}
      modelSrc={modelSrc}
      asciiCellSize={asciiCellSize}
      transparentBackground
    />
  )
}
