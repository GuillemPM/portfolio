export const locales = ["en", "es", "ca"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export type Messages = {
  nav: { solutions: string; contact: string; startProject: string };
  widget: {
    needHelp: string;
    startCall: string;
    inputPlaceholder: string;
    inputPlaceholderNewConversation: string;
  };
  trust: { label: string };
  solutions: {
    title: string;
    cards: {
      custom: { title: string; text: string };
      ai: { title: string; text: string };
      web: { title: string; text: string };
      data: { title: string; text: string };
    };
  };
  cta: {
    hero: string;
    solutions: string;
    process: string;
    contact: string;
  };
  target: { title: string; subtitle: string; sectors: [string, string, string, string, string, string, string] };
  results: { title: string; items: [string, string, string] };
  process: { title: string; steps: [string, string, string] };
  why: { title: string; items: [string, string, string, string, string] };
  contact: {
    title: string;
    body: string;
    whatsappPrefix: string;
    whatsappLink: string;
    scheduleTitle: string;
    scheduleBody: string;
    scheduleCta: string;
    whatsappTitle: string;
    whatsappBody: string;
    backHome: string;
  };
  hero: {
    name: string;
    titleBefore: string;
    titleHighlight: string;
    body: string;
  };
  footer: { line: string; source: string };
};
