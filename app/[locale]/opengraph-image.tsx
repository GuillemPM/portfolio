import { ImageResponse } from "next/og";
import { locales } from "@/lib/i18n/types";
import {
  SITE_NAME,
  resolveSiteLocale,
  siteTitle,
} from "@/lib/i18n/siteMetadata";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveSiteLocale(raw);
  const title = siteTitle[locale];
  const [name, role] = title.split(" | ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #ffffff 0%, #f4f7fb 55%, #e8eef8 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#2563eb",
            fontWeight: 600,
          }}
        >
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.1,
              fontWeight: 700,
              color: "#0f172a",
              maxWidth: 960,
            }}
          >
            {name ?? SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#475569",
              maxWidth: 900,
            }}
          >
            {role ?? title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#64748b",
          }}
        >
          guillem.pm
        </div>
      </div>
    ),
    { ...size },
  );
}
