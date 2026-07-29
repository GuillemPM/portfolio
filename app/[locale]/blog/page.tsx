import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/portfolio/BlogPages";
import { getAllPostMetas } from "@/lib/blog/posts";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { locales, type Locale } from "@/lib/i18n/types";
import {
  SITE_NAME,
  languageAlternates,
  localizedUrl,
  openGraphLocale,
  resolveSiteLocale,
} from "@/lib/i18n/siteMetadata";

function resolveLocale(raw: string): Locale {
  return resolveSiteLocale(raw);
}

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveSiteLocale(raw);
  const m = dictionaries[locale];
  const canonical = localizedUrl(locale, "/blog");
  const title = m.blog.title;
  const description = m.blog.subtitle;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates("/blog"),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: openGraphLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale: raw } = await params;
  const validLocale = resolveLocale(raw);
  const posts = getAllPostMetas(validLocale);

  return (
    <LanguageProvider initialLocale={validLocale}>
      <BlogIndexPage posts={posts} />
    </LanguageProvider>
  );
}
