"use client";

import { useEffect, useState } from "react";

type Phase = "enter" | "exit" | "gone";

const BLUE = "var(--color-on-tertiary-container)";
const TRACK = "#e4e4e7";

export function PageLoader() {
  const [phase, setPhase] = useState<Phase>("enter");
  const [fill, setFill] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const minMs = prefersReduced ? 0 : 600;

    const loadPromise = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const minPromise = new Promise<void>((resolve) => {
      window.setTimeout(resolve, minMs);
    });

    const done = () => {
      if (!cancelled) {
        setFill(100);
        setPhase("exit");
      }
    };

    if (prefersReduced) {
      void Promise.all([loadPromise, minPromise]).then(done);
      return () => {
        cancelled = true;
      };
    }

    const start = performance.now();

    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      setFill(Math.min(92, 92 * (1 - Math.exp(-elapsed / 1050))));
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    void Promise.all([loadPromise, minPromise]).then(() => {
      cancelAnimationFrame(rafId);
      done();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (phase !== "enter") return;
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ms = prefersReduced ? 0 : 480;
    const id = window.setTimeout(() => setPhase("gone"), ms);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (phase === "gone") return null;

  const fillClamped = Math.min(100, Math.max(0, fill));
  const percentDisplay = Math.min(100, Math.round(fillClamped));
  const fillGradient =
    fillClamped <= 0
      ? `linear-gradient(to top, ${TRACK} 0%, ${TRACK} 100%)`
      : fillClamped >= 100
        ? `linear-gradient(to top, ${BLUE} 0%, ${BLUE} 100%)`
        : `linear-gradient(to top, ${BLUE} 0%, ${BLUE} ${fillClamped}%, ${TRACK} ${fillClamped}%, ${TRACK} 100%)`;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-primary-container transition-opacity duration-500 ease-out motion-reduce:duration-0 ${
        phase === "exit"
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
      aria-busy={phase === "enter"}
      aria-live="polite"
      role="status"
    >
      <span className="sr-only">Cargando</span>
      <div
        className="flex flex-col items-center gap-3 sm:gap-4"
        role="progressbar"
        aria-valuenow={percentDisplay}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de carga"
      >
        <div
          aria-hidden
          className="select-none text-6xl font-black tracking-tighter sm:text-7xl"
          style={{
            backgroundImage: fillGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            filter:
              "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08)) drop-shadow(0 4px 12px rgba(37, 99, 235, 0.12))",
          }}
        >
          GP.
        </div>
        <p
          className="m-0 font-label text-[11px] font-medium tabular-nums tracking-[0.22em] text-on-surface-variant sm:text-xs"
          aria-hidden
        >
          {percentDisplay}%
        </p>
      </div>
    </div>
  );
}
