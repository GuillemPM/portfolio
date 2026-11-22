import { createHighlighter, type Highlighter } from "shiki";
import { alLanguage } from "@/lib/al-language";

const BUNDLED_LANGS = [
  "json",
  "typescript",
  "javascript",
  "tsx",
  "jsx",
  "bash",
  "shell",
  "plaintext",
  "text",
  "markdown",
] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      langs: [alLanguage, ...BUNDLED_LANGS],
      themes: ["github-light"],
    });
  }
  return highlighterPromise;
}

function resolveLang(language: string): string {
  const normalized = language.trim().toLowerCase() || "plaintext";
  if (normalized === "businesscentral") return "al";
  if (normalized === "text" || normalized === "txt") return "plaintext";
  if (normalized === "sh" || normalized === "zsh") return "bash";
  return normalized;
}

export async function highlightCode(
  code: string,
  language: string,
): Promise<string> {
  const highlighter = await getHighlighter();
  const lang = resolveLang(language);
  const loaded = highlighter.getLoadedLanguages();

  let effectiveLang = lang;
  if (!loaded.includes(lang)) {
    try {
      await highlighter.loadLanguage(lang as Parameters<Highlighter["loadLanguage"]>[0]);
      effectiveLang = lang;
    } catch {
      effectiveLang = "plaintext";
    }
  }

  return highlighter.codeToHtml(code, {
    lang: effectiveLang,
    theme: "github-light",
  });
}
