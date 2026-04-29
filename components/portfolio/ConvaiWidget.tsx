"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const AGENT_ID = "agent_2201kq83gnnyftrtz1teed5zecch";

export function ConvaiWidget() {
  const { locale, messages } = useLanguage();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const textContents = JSON.stringify({
      main_label: messages.widget.needHelp,
      start_call: messages.widget.startCall,
      input_placeholder: messages.widget.inputPlaceholder,
      input_placeholder_text_only: messages.widget.inputPlaceholder,
      input_placeholder_new_conversation:
        messages.widget.inputPlaceholderNewConversation,
    });

    const widget = document.createElement("elevenlabs-convai");
    widget.setAttribute("agent-id", AGENT_ID);
    widget.setAttribute("text-contents", textContents);
    widget.setAttribute("variant", "full");
    widget.setAttribute("default-expanded", "false");
    widget.setAttribute("always-expanded", "false");
    widget.setAttribute("text-input", "true");
    widget.setAttribute("dismissible", "true");

    host.replaceChildren(widget);

    // The widget renders a "Powered by ElevenAgents" banner unless the
    // server-side `disable_banner` flag is on (paid plans only).
    // We inject a stylesheet inside the open shadow root to hide it.
    let frame = 0;
    let cancelled = false;
    const injectHideBannerStyles = () => {
      const root = widget.shadowRoot;
      if (!root) return false;
      root
        .querySelector("style[data-hide-elevenlabs-banner]")
        ?.remove();
      let style = root.querySelector<HTMLStyleElement>(
        "style[data-customize-elevenlabs-widget]",
      );
      if (!style) {
        style = document.createElement("style");
        style.setAttribute("data-customize-elevenlabs-widget", "");
        root.appendChild(style);
      }
      style.textContent = `
        p:has(> a[href*="elevenlabs.io"]) { display: none !important; }
      `;
      return true;
    };
    const tick = () => {
      if (cancelled) return;
      if (injectHideBannerStyles()) return;
      frame = requestAnimationFrame(tick);
    };
    tick();

    // Start in the widget's native hidden state: this is the same state users
    // reach after pressing the trigger's dismiss/collapse button.
    let dismissFrame = 0;
    const dismissToAvatarOnly = () => {
      if (cancelled) return;
      const trigger = widget.shadowRoot?.querySelector(
        ".rounded-sheet, .rounded-compact-sheet",
      );
      const buttons = trigger?.querySelectorAll("button");
      const dismissButton = buttons?.[buttons.length - 1] as
        | HTMLButtonElement
        | undefined;

      if (dismissButton) {
        dismissButton.click();
        return;
      }

      dismissFrame = requestAnimationFrame(dismissToAvatarOnly);
    };
    dismissFrame = requestAnimationFrame(dismissToAvatarOnly);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(dismissFrame);
      widget.remove();
    };
  }, [
    locale,
    messages.widget.needHelp,
    messages.widget.startCall,
    messages.widget.inputPlaceholder,
    messages.widget.inputPlaceholderNewConversation,
  ]);

  return <div ref={hostRef} />;
}
