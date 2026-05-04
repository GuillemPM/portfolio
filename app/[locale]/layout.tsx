import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { PageLoader } from "@/components/portfolio/PageLoader";
import { Analytics } from "@vercel/analytics/next"
import { locales } from "@/lib/i18n/types";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SEO_DESCRIPTIONS = {
  es: "Arquitecto de software: herramientas internas, integraciones de IA, plataformas y transformación digital.",
  en: "Software architect: internal tools, AI integrations, platforms, and digital transformation for ambitious companies.",
  ca: "Arquitecte de programari: eines internes, integracions d'IA, plataformes i transformació digital per a empreses ambicioses.",
} as const;

const HREFLANG_URLS = {
  es: "https://www.guillem.pm",
  en: "https://www.guillem.pm/en",
  ca: "https://www.guillem.pm/ca",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = SEO_DESCRIPTIONS[locale as keyof typeof SEO_DESCRIPTIONS] ?? SEO_DESCRIPTIONS.es;
  const canonicalUrl = locale === "es" 
    ? "https://www.guillem.pm" 
    : `https://www.guillem.pm/${locale}`;
  const selfReference = HREFLANG_URLS[locale as keyof typeof HREFLANG_URLS] ?? "https://www.guillem.pm";

  return {
    title: "Guillem Padilla - Software Architect",
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: HREFLANG_URLS.es,
        en: HREFLANG_URLS.en,
        ca: HREFLANG_URLS.ca,
        "x-default": HREFLANG_URLS.es,
        [locale]: selfReference,
      },
    },
    openGraph: {
      title: "Guillem Padilla - Software Architect",
      description: description,
      url: canonicalUrl,
      siteName: "Guillem Padilla",
      locale: locale === "ca" ? "ca_ES" : locale === "en" ? "en_US" : "es_ES",
      type: "website",
      images: [
        {
          url: "https://www.guillem.pm/logo.webp",
          width: 1200,
          height: 630,
          alt: "Guillem Padilla - Software Architect",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Guillem Padilla - Software Architect",
      description: description,
      images: ["https://www.guillem.pm/logo.webp"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const htmlLang = locale === "ca" ? "ca" : locale === "es" ? "es" : "en";
  const description = SEO_DESCRIPTIONS[locale as keyof typeof SEO_DESCRIPTIONS] ?? SEO_DESCRIPTIONS.es;

  return (
    <html
      className={`dark ${inter.variable} ${spaceGrotesk.variable} h-full`}
      lang={htmlLang}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0a0a0b" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          crossOrigin="anonymous"
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Guillem Padilla",
              url: "https://www.guillem.pm",
              jobTitle: "Software Architect",
              description: description,
              sameAs: [
                "https://www.linkedin.com/in/guillempadilla",
                "https://github.com/guillempadilla",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <PageLoader />
        {children}
        <Analytics />
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}