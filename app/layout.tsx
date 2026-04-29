import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { PageLoader } from "@/components/portfolio/PageLoader";
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

export const metadata: Metadata = {
  title: "Guillem Padilla - Software Architect",
  description:
    "Arquitecto de software: herramientas internas, integraciones de IA, plataformas y transformación digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`dark ${inter.variable} ${spaceGrotesk.variable} h-full`}
      lang="es"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          crossOrigin="anonymous"
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        {/* Material Symbols has no next/font package; the icon font is loaded from Google. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- icon font, not a text family */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <PageLoader />
        {children}
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
