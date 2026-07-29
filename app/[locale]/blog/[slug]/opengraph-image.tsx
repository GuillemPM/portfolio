import { ImageResponse } from "next/og";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog/posts";
import { SITE_NAME, resolveSiteLocale } from "@/lib/i18n/siteMetadata";
import { locales } from "@/lib/i18n/types";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export function generateStaticParams(): { locale: string; slug: string }[] {
  return locales.flatMap((locale) =>
    getAllPostSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export default async function BlogOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = resolveSiteLocale(raw);
  const post = getPostBySlug(locale, slug);
  const title = post?.title ?? SITE_NAME;
  const description = post?.description ?? "";

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
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#2563eb",
            fontWeight: 600,
          }}
        >
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              lineHeight: 1.15,
              fontWeight: 700,
              color: "#0f172a",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.35,
                color: "#475569",
                maxWidth: 980,
              }}
            >
              {description.length > 140
                ? `${description.slice(0, 137)}...`
                : description}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#64748b",
          }}
        >
          guillem.pm/blog
        </div>
      </div>
    ),
    { ...size },
  );
}
