import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/portfolio/BlogPages";
import {
  getAllPostSlugs,
  getPostBySlug,
  getPostLocaleHrefs,
  postLanguageAlternates,
} from "@/lib/blog/posts";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import {
  SITE_NAME,
  SITE_URL,
  localizedUrl,
  openGraphLocale,
  resolveSiteLocale,
} from "@/lib/i18n/siteMetadata";
import { locales, type Locale } from "@/lib/i18n/types";

function resolveLocale(raw: string): Locale {
  return resolveSiteLocale(raw);
}

export function generateStaticParams(): { locale: string; slug: string }[] {
  return locales.flatMap((locale) =>
    getAllPostSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const post = getPostBySlug(locale, slug);
  if (!post) {
    return {};
  }

  const canonical = localizedUrl(locale, `/blog/${slug}`);
  const title = post.title;

  return {
    title,
    description: post.description,
    alternates: {
      canonical,
      languages: postLanguageAlternates(post.id),
    },
    openGraph: {
      title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      url: canonical,
      siteName: SITE_NAME,
      locale: openGraphLocale(locale),
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
    },
    authors: [{ name: post.author, url: SITE_URL }],
  };
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<React.ReactElement> {
  const { locale: raw, slug } = await params;
  const validLocale = resolveLocale(raw);
  const post = getPostBySlug(validLocale, slug);

  if (!post) {
    notFound();
  }

  const canonical = localizedUrl(validLocale, `/blog/${slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: validLocale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: post.author,
      url: SITE_URL,
    },
    url: canonical,
  };

  return (
    <LanguageProvider initialLocale={validLocale}>
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BlogPostPage localeHrefs={getPostLocaleHrefs(post.id)} post={post} />
      </>
    </LanguageProvider>
  );
}
