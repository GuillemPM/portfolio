export const locales = ["en", "es", "ca"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export type Messages = {
  nav: { solutions: string; contact: string; startProject: string };
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
  cta: { bookCall: string };
  target: { title: string; subtitle: string; sectors: [string, string, string, string, string, string, string] };
  results: { title: string; items: [string, string, string] };
  process: { title: string; steps: [string, string, string] };
  why: { title: string; items: [string, string, string, string, string] };
  contact: { title: string; body: string };
  hero: {
    name: string;
    titleBefore: string;
    titleHighlight: string;
    body: string;
  };
  footer: { line: string; source: string };
};
