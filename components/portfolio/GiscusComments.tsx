"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/types";

const GISCUS_LANG: Record<Locale, string> = {
  en: "en",
  es: "es",
  ca: "ca",
};

const GISCUS_ORIGIN = "https://giscus.app";

export function GiscusComments({ locale }: { locale: Locale }): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const script = document.createElement("script");
    script.src = `${GISCUS_ORIGIN}/client.js`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "guillempm/portfolio");
    script.setAttribute("data-repo-id", "R_kgDOSKj9Fw");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOSKj9F84DLvC5");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "noborder_light");
    script.setAttribute("data-lang", GISCUS_LANG[locale]);
    script.setAttribute("data-loading", "lazy");
    container.appendChild(script);

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (!iframe?.contentWindow) return;
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: "noborder_light" } } },
        GISCUS_ORIGIN,
      );
      observer.disconnect();
    });
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      container.replaceChildren();
    };
  }, [locale]);

  return (
    <div
      className="mt-16 rounded-sm bg-primary-container text-on-background"
      style={{ colorScheme: "light" }}
    >
      <div ref={containerRef} />
    </div>
  );
}
