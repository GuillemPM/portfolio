"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedPath } from "@/lib/i18n/getLocalizedPath";
import {
  LocaleHrefProvider,
  type LocaleHrefMap,
} from "@/lib/i18n/LocaleHrefContext";
import type { BlogPostMeta } from "@/lib/blog/types";
import { GiscusComments } from "./GiscusComments";
import { primaryButtonClass } from "./PortfolioHome";
import { SiteNav } from "./SiteNav";

function formatPostDate(date: string, locale: string): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat(locale === "ca" ? "ca-ES" : locale === "en" ? "en-GB" : "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

const inlineCodeClassName =
  "rounded-sm bg-surface-container-low px-1.5 py-0.5 font-mono text-[0.9em] text-on-background";

/** Renders `backtick` spans like blog body inline code. */
function InlineMarkdownText({ text }: { text: string }): React.ReactElement {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
          return (
            <code className={inlineCodeClassName} key={index}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function BlogIndexPage({ posts }: { posts: BlogPostMeta[] }): React.ReactElement {
  const { messages: m, locale } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
      <SiteNav m={m} />
      <main className="mx-auto w-full max-w-8xl grow px-8 pb-24 pt-site-nav-content md:px-16">
        <header className="mb-16 max-w-3xl">
          <h1 className="text-headline-lg text-on-background">{m.blog.title}</h1>
          <p className="text-body-lg mt-6 text-on-surface-variant">{m.blog.subtitle}</p>
        </header>
        {posts.length === 0 ? (
          <p className="text-body-lg text-on-surface-variant">{m.blog.empty}</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  className="group block border border-subtle bg-primary-container p-8 transition-colors hover:bg-surface-container-low"
                  href={getLocalizedPath(pathname, `/blog/${post.slug}`)}
                >
                  <time className="text-label-caps text-[10px] text-on-surface-variant" dateTime={post.date}>
                    {formatPostDate(post.date, locale)}
                  </time>
                  <h2 className="mt-3 text-2xl font-medium text-on-background group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-body-md mt-3 text-on-surface-variant/80">
                    <InlineMarkdownText text={post.description} />
                  </p>
                  <span className="text-label-caps mt-6 inline-block text-[10px] text-on-tertiary-container">
                    {m.blog.readMore}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export function BlogPostPage({
  post,
  localeHrefs,
  children,
}: {
  post: {
    title: string;
    description: string;
    date: string;
    author: string;
  };
  localeHrefs: LocaleHrefMap;
  children: React.ReactNode;
}): React.ReactElement {
  const { messages: m, locale } = useLanguage();
  const pathname = usePathname();

  return (
    <LocaleHrefProvider hrefs={localeHrefs}>
      <div className="flex min-h-screen flex-col bg-primary-container text-on-surface antialiased">
        <SiteNav m={m} />
        <main className="mx-auto w-full max-w-8xl grow px-8 pb-24 pt-site-nav-content md:px-16">
          <Link
            className={`${primaryButtonClass} mb-12 inline-flex px-6 py-3 text-[10px]`}
            href={getLocalizedPath(pathname, "/blog")}
          >
            <span className="relative z-10">{m.blog.backToBlog}</span>
          </Link>
          <article className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-label-caps text-[10px] text-on-surface-variant">
              <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.author}</span>
            </div>
            <h1 className="text-headline-lg mt-4 text-on-background">{post.title}</h1>
            <p className="text-body-lg mt-6 text-on-surface-variant">
              <InlineMarkdownText text={post.description} />
            </p>
            <div className="blog-prose text-body-lg mt-12 text-on-surface-variant">
              {children}
            </div>
            <GiscusComments locale={locale} />
          </article>
        </main>
      </div>
    </LocaleHrefProvider>
  );
}
