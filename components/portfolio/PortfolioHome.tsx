"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedPath } from "@/lib/i18n/getLocalizedPath";
import type { BlogPostMeta } from "@/lib/blog/types";
import {
  certificationMeta,
  certificationOrder,
  secondaryBadgeMeta,
  secondaryBadgeOrder,
} from "@/lib/certifications";
import type { Messages } from "@/lib/i18n/types";
import { Hero } from "./Hero";
import { SiteNav } from "./SiteNav";

function isSvgSrc(src: string): boolean {
  return src.endsWith(".svg");
}

export const primaryButtonClass =
  "relative inline-flex overflow-hidden border border-on-tertiary-container/40 bg-transparent px-8 py-4 text-label-caps uppercase text-on-background transition-all duration-300 hover:border-on-tertiary-container hover:bg-on-tertiary-container/5 hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] group";

export function PrimaryButton({
  children,
  href,
  external,
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
}): React.ReactElement {
  const pathname = usePathname();
  const localizedHref = external ? href : getLocalizedPath(pathname, href);

  return (
    <Link
      href={localizedHref}
      className={primaryButtonClass}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-on-tertiary-container/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
    </Link>
  );
}

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

function SiteFooter({ m }: { m: Messages }): React.ReactElement {
  return (
    <footer className="mt-32 w-full border-t border-subtle bg-primary-container">
      <div className="mx-auto flex max-w-8xl flex-col items-end justify-between gap-8 px-8 py-24 md:flex-row md:px-16">
        <div className="flex flex-col gap-4">
          <div className="text-4xl font-black tracking-tighter text-on-background/10">GP.</div>
          <div className="text-[9px] font-sans uppercase tracking-widest text-on-surface-variant">
            {m.footer.line}
          </div>
        </div>
        <div className="flex gap-8">
          <a
            className="text-[9px] font-sans uppercase tracking-widest text-on-surface-variant opacity-100 transition-colors duration-300 hover:text-blue-600 hover:opacity-80"
            href="https://www.linkedin.com/in/gpadillam"
            rel="me noopener noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <a
            className="text-[9px] font-sans uppercase tracking-widest text-on-surface-variant opacity-100 transition-colors duration-300 hover:text-blue-600 hover:opacity-80"
            href="https://github.com/GuillemPM"
            rel="me noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export function PortfolioHome({
  latestPosts,
}: {
  latestPosts: BlogPostMeta[];
}): React.ReactElement {
  const { messages: m, locale } = useLanguage();
  const pathname = usePathname();

  return (
    <>
      <SiteNav m={m} />
      <main className="min-h-0 grow pt-site-nav">
        <Hero />

        <section className="mx-auto mb-section-gap max-w-8xl px-8 md:px-16" id="about">
          <h2 className="mb-8 text-headline-lg text-on-background">{m.about.title}</h2>
          <div className="grid grid-cols-12 items-start gap-gutter">
            <div className="order-2 col-span-12 flex flex-col gap-6 lg:order-1 lg:col-span-7">
              {m.about.paragraphs.map((paragraph, i) => (
                <p className="text-body-lg text-on-surface-variant" key={i}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="order-1 col-span-12 flex justify-center lg:order-2 lg:col-span-4 lg:col-start-9 lg:justify-end">
              <div className="-rotate-2 rounded-2xl shadow-[0_20px_45px_-10px_rgba(0,0,0,0.45)]">
                <Image
                  alt={m.hero.name}
                  className="w-full max-w-sm rounded-2xl object-cover object-center lg:max-w-none"
                  height={640}
                  quality={90}
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 24rem, 100vw"
                  src="/images/guillermo-about.png"
                  width={480}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto mb-section-gap max-w-8xl px-8 md:px-16"
          id="certifications"
        >
          <div className="mb-4">
            <h2 className="text-headline-lg text-on-background">{m.certifications.title}</h2>
          </div>
          <p className="text-body-lg mb-12 max-w-2xl text-on-surface-variant">
            {m.certifications.subtitle}
          </p>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {certificationOrder.map((id, index) => {
              const cert = m.certifications.items[id];
              const meta = certificationMeta[id];
              return (
                <article className="flex flex-col items-center text-center" key={id}>
                  <a
                    className="transition-opacity duration-300 hover:opacity-90"
                    href={meta.credentialUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt={meta.badgeAlt}
                      className="h-44 w-44 object-contain sm:h-52 sm:w-52"
                      fetchPriority={index === 0 ? "high" : undefined}
                      height={208}
                      loading={index === 0 ? "eager" : "lazy"}
                      quality={90}
                      sizes="208px"
                      src={meta.badgeSrc}
                      unoptimized={isSvgSrc(meta.badgeSrc)}
                      width={208}
                    />
                  </a>
                  <p className="text-label-caps mt-6 text-[10px] text-on-tertiary-container">
                    {cert.issuer}
                  </p>
                  <h3 className="mt-2 max-w-[16rem] text-lg font-medium text-on-background">
                    {cert.title}
                  </h3>
                  <a
                    className="text-label-caps mt-4 text-[10px] uppercase text-on-surface-variant transition-colors duration-300 hover:text-on-background"
                    href={meta.credentialUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {m.certifications.viewCredential} →
                  </a>
                </article>
              );
            })}
            <article className="flex flex-col items-center justify-center text-center">
              <div className="flex h-44 w-44 items-center justify-center border border-dashed border-outline sm:h-52 sm:w-52">
                <p className="text-label-caps text-[10px] text-on-surface-variant">
                  {m.certifications.comingSoon}
                </p>
              </div>
              <p className="text-body-md mt-6 max-w-[12rem] text-sm text-on-surface-variant">
                {m.certifications.moreOnTheWay}
              </p>
            </article>
          </div>

          {secondaryBadgeOrder.length > 0 ? (
            <div className="mt-16 border-t border-subtle pt-12">
              <h3 className="text-label-caps mb-8 text-[10px] text-on-surface-variant">
                {m.certifications.secondaryTitle}
              </h3>
              <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                {secondaryBadgeOrder.map((id) => {
                  const copy = m.certifications.secondaryItems[id];
                  const meta = secondaryBadgeMeta[id];
                  return (
                    <li className="flex flex-col items-center text-center" key={id}>
                      <a
                        className="group block origin-center"
                        href={meta.credentialUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Image
                          alt={meta.badgeAlt}
                          className="h-28 w-28 object-contain transition-transform duration-300 ease-out will-change-transform group-hover:scale-105 group-hover:-rotate-6 group-focus-visible:scale-105 group-focus-visible:-rotate-4 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 sm:h-32 sm:w-32"
                          height={128}
                          quality={90}
                          sizes="128px"
                          src={meta.badgeSrc}
                          unoptimized={isSvgSrc(meta.badgeSrc)}
                          width={128}
                        />
                      </a>
                      <p className="text-label-caps mt-4 text-[10px] text-on-tertiary-container">
                        {copy.issuer}
                      </p>
                      <a
                        className="text-label-caps mt-2 text-[9px] uppercase text-on-surface-variant transition-colors duration-300 hover:text-on-background"
                        href={meta.credentialUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {m.certifications.viewCredential} →
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="mx-auto mb-section-gap max-w-8xl px-8 md:px-16" id="blog">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-headline-lg text-on-background">{m.blog.latestTitle}</h2>
              <p className="text-body-lg mt-4 max-w-xl text-on-surface-variant">
                {m.blog.subtitle}
              </p>
            </div>
            <PrimaryButton href="/blog">{m.cta.viewAllPosts}</PrimaryButton>
          </div>
          {latestPosts.length === 0 ? (
            <p className="text-body-lg text-on-surface-variant">{m.blog.empty}</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {latestPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    className="group block border border-subtle bg-primary-container p-8 transition-colors hover:bg-surface-container-low"
                    href={getLocalizedPath(pathname, `/blog/${post.slug}`)}
                  >
                    <time
                      className="text-label-caps text-[10px] text-on-surface-variant"
                      dateTime={post.date}
                    >
                      {formatPostDate(post.date, locale)}
                    </time>
                    <h3 className="mt-3 text-xl font-medium text-on-background group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-body-md mt-3 text-on-surface-variant/80">
                      {post.description}
                    </p>
                    <span className="text-label-caps mt-6 inline-block text-[10px] text-on-tertiary-container">
                      {m.blog.readMore}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          className="mx-auto mb-section-gap max-w-8xl border-t border-subtle px-8 pb-8 pt-32 md:px-16"
          id="contact"
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="text-headline-lg mb-8 max-w-3xl text-on-background">{m.contact.title}</h2>
            <p className="text-body-lg mb-12 max-w-2xl text-on-surface-variant">
              {m.contact.body}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <PrimaryButton href="/contact">{m.cta.contact}</PrimaryButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter m={m} />
    </>
  );
}
