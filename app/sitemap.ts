import { MetadataRoute } from "next";
import {
  getAllPostMetas,
  getPostTranslations,
  postLanguageAlternates,
} from "@/lib/blog/posts";
import {
  SITE_URL,
  languageAlternates,
  localizedUrl,
} from "@/lib/i18n/siteMetadata";
import { locales } from "@/lib/i18n/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const seenPostIds = new Set<string>();
  const blogPosts: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const post of getAllPostMetas(locale)) {
      if (seenPostIds.has(post.id)) continue;
      seenPostIds.add(post.id);

      for (const translation of getPostTranslations(post.id)) {
        blogPosts.push({
          url: localizedUrl(translation.locale, `/blog/${translation.slug}`),
          lastModified: new Date(translation.date || Date.now()),
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: postLanguageAlternates(post.id),
          },
        });
      }
    }
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: languageAlternates(),
      },
    },
    {
      url: localizedUrl("es", "/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: languageAlternates("/contact"),
      },
    },
    {
      url: localizedUrl("es", "/blog"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: languageAlternates("/blog"),
      },
    },
    ...blogPosts,
  ];
}
