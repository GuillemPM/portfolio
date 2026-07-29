import { getAllPostMetas, getPostTranslations } from "@/lib/blog/posts";
import {
  SITE_NAME,
  SITE_URL,
  localizedUrl,
  siteDescription,
} from "@/lib/i18n/siteMetadata";
import { locales } from "@/lib/i18n/types";

/**
 * llmstxt.org-style index for AI agents (see https://llmstxt.org/).
 */
export function buildLlmsTxt(): string {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${siteDescription.en}`,
    "",
    "Personal site for Guillermo Padilla Martin: software architecture, Microsoft Business Central, and applied AI. Available in Spanish (default), English, and Catalan.",
    "",
    "## Pages",
    "",
    `- [Home (ES)](${SITE_URL}): ${siteDescription.es}`,
    `- [Home (EN)](${localizedUrl("en")}): ${siteDescription.en}`,
    `- [Home (CA)](${localizedUrl("ca")}): ${siteDescription.ca}`,
    `- [Blog (ES)](${localizedUrl("es", "/blog")}): Notes on building software`,
    `- [Blog (EN)](${localizedUrl("en", "/blog")}): Notes on building software`,
    `- [Blog (CA)](${localizedUrl("ca", "/blog")}): Notes on building software`,
    `- [Contact (ES)](${localizedUrl("es", "/contact")}): Reach out on LinkedIn`,
    `- [Contact (EN)](${localizedUrl("en", "/contact")}): Reach out on LinkedIn`,
    `- [Contact (CA)](${localizedUrl("ca", "/contact")}): Reach out on LinkedIn`,
    "",
    "## Blog posts",
    "",
  ];

  const seen = new Set<string>();
  for (const locale of locales) {
    for (const post of getAllPostMetas(locale)) {
      if (seen.has(post.id)) continue;
      seen.add(post.id);

      const translations = getPostTranslations(post.id);
      const primary =
        translations.find((entry) => entry.locale === "es") ?? translations[0];
      lines.push(
        `- [${primary.title}](${localizedUrl(primary.locale, `/blog/${primary.slug}`)}): ${primary.description}`,
      );

      const others = translations.filter(
        (entry) =>
          !(
            entry.locale === primary.locale && entry.slug === primary.slug
          ),
      );
      for (const entry of others) {
        lines.push(
          `  - [${entry.locale.toUpperCase()}](${localizedUrl(entry.locale, `/blog/${entry.slug}`)}): ${entry.title}`,
        );
      }
    }
  }

  if (seen.size === 0) {
    lines.push("- No posts published yet.");
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [LinkedIn](https://www.linkedin.com/in/gpadillam): Professional profile`,
    `- [GitHub](https://github.com/GuillemPM): Code and experiments`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): Machine-readable site map`,
    `- [Robots](${SITE_URL}/robots.txt): Crawler rules`,
    "",
  );

  return lines.join("\n");
}
