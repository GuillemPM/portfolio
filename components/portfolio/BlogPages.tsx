"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Markdown from "react-markdown";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedPath } from "@/lib/i18n/getLocalizedPath";
import type { BlogPostMeta } from "@/lib/blog/types";
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
                  <p className="text-body-md mt-3 text-on-surface-variant/80">{post.description}</p>
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
}: {
  post: { title: string; description: string; date: string; content: string };
}): React.ReactElement {
  const { messages: m, locale } = useLanguage();
  const pathname = usePathname();

  return (
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
          <time className="text-label-caps text-[10px] text-on-surface-variant" dateTime={post.date}>
            {formatPostDate(post.date, locale)}
          </time>
          <h1 className="text-headline-lg mt-4 text-on-background">{post.title}</h1>
          <p className="text-body-lg mt-6 text-on-surface-variant">{post.description}</p>
          <div className="blog-prose text-body-lg mt-12 text-on-surface-variant">
            <MarkdownContent content={post.content} />
          </div>
        </article>
      </main>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }): React.ReactElement {
  return (
    <Markdown
      components={{
        p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-medium text-on-background">{children}</strong>,
        a: ({ href, children }) => (
          <a
            className="text-on-tertiary-container underline-offset-4 hover:underline"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="mb-6 list-disc space-y-2 pl-6">{children}</ul>,
        ol: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-6">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        h2: ({ children }) => (
          <h2 className="mb-4 mt-10 text-2xl font-medium text-on-background">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-3 mt-8 text-xl font-medium text-on-background">{children}</h3>
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
