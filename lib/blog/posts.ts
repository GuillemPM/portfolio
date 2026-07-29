import fs from "node:fs";
import path from "node:path";
import { locales, type Locale } from "@/lib/i18n/types";
import {
  SITE_NAME,
  languageAlternates,
  localizedUrl,
} from "@/lib/i18n/siteMetadata";
import type { BlogPost, BlogPostMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, content: raw.trim() };
  }

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
    meta[key] = value;
  }

  return { meta, content: match[2].trim() };
}

function localeDir(locale: Locale): string {
  return path.join(CONTENT_DIR, locale);
}

function toMeta(
  locale: Locale,
  slug: string,
  meta: Record<string, string>,
): BlogPostMeta {
  return {
    id: meta.id ?? slug,
    slug,
    locale,
    title: meta.title ?? slug,
    description: meta.description ?? "",
    date: meta.date ?? "",
    author: meta.author ?? SITE_NAME,
  };
}

export function getAllPostMetas(locale: Locale): BlogPostMeta[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) {
    return [];
  }

  const posts = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, filename), "utf8");
      const { meta } = parseFrontmatter(raw);
      return toMeta(locale, slug, meta);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export function getPostBySlug(locale: Locale, slug: string): BlogPost | null {
  const filePath = path.join(localeDir(locale), `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, content } = parseFrontmatter(raw);

  return {
    ...toMeta(locale, slug, meta),
    content,
  };
}

export function getAllPostSlugs(locale: Locale): string[] {
  return getAllPostMetas(locale).map((post) => post.slug);
}

/** Same logical post across locales (matched by frontmatter `id`). */
export function getPostTranslations(id: string): BlogPostMeta[] {
  return locales
    .map((locale) => getAllPostMetas(locale).find((post) => post.id === id))
    .filter((post): post is BlogPostMeta => Boolean(post));
}

export function postLanguageAlternates(id: string): Record<string, string> {
  const translations = getPostTranslations(id);
  if (translations.length === 0) {
    return languageAlternates("/blog");
  }

  const languages: Record<string, string> = {};
  for (const post of translations) {
    languages[post.locale] = localizedUrl(post.locale, `/blog/${post.slug}`);
  }
  const defaultPost =
    translations.find((post) => post.locale === "es") ?? translations[0];
  languages["x-default"] = localizedUrl(
    defaultPost.locale,
    `/blog/${defaultPost.slug}`,
  );
  return languages;
}

/** Relative pathnames for the language switcher (no origin). */
export function getPostLocaleHrefs(id: string): Partial<Record<Locale, string>> {
  const hrefs: Partial<Record<Locale, string>> = {};
  for (const post of getPostTranslations(id)) {
    hrefs[post.locale] =
      post.locale === "es"
        ? `/blog/${post.slug}`
        : `/${post.locale}/blog/${post.slug}`;
  }
  return hrefs;
}
