"use client";

import { useEffect } from "react";

type WidgetWindow = Window & {
  ChatBotWidget?: { close: () => void };
};

const SCRIPT_ID = "baudhika-chat-widget-script";
const STYLE_ID = "baudhika-chat-widget-visibility";
const ACTIVE_ATTRIBUTE = "data-baudhika-chat-active";

/**
 * Loads a THIRD-PARTY script (school-erp-chatbot.onrender.com). That is a
 * supply-chain decision: if that host is compromised, so is every page this
 * mounts on. Mitigations: promotional routes only, the production CSP allows
 * exactly this one script host, and this kill switch removes it with one env
 * line and no code change: NEXT_PUBLIC_CHAT_WIDGET=disabled
 */
export function ChatWidget() {
  const disabled = process.env.NEXT_PUBLIC_CHAT_WIDGET === "disabled";

  useEffect(() => {
    if (disabled) return;
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `html:not([${ACTIVE_ATTRIBUTE}]) #cbw-launch, html:not([${ACTIVE_ATTRIBUTE}]) #cbw-panel { display: none !important; }`;
      document.head.appendChild(style);
    }

    document.documentElement.setAttribute(ACTIVE_ATTRIBUTE, "");
    for (const id of ["cbw-launch", "cbw-panel"]) {
      document.getElementById(id)?.style.removeProperty("display");
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://school-erp-chatbot.onrender.com/widget.js";
      script.async = true;
      script.dataset.title = "Baudhika ERP Assistant";
      script.dataset.subtitle = "Ask us about Baudhika ERP";
      script.dataset.rememberPosition = "false";
      script.dataset.theme = "auto";
      script.onerror = () => script.remove();
      document.body.appendChild(script);
    }

    return () => {
      if (disabled) return;
      document.documentElement.removeAttribute(ACTIVE_ATTRIBUTE);
      (window as WidgetWindow).ChatBotWidget?.close();
      for (const id of ["cbw-launch", "cbw-panel"]) {
        document.getElementById(id)?.style.setProperty("display", "none", "important");
      }
    };
  }, [disabled]);

  return null;
}
