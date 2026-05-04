import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/types";

const BASE_URL = "https://www.guillem.pm";

export default function sitemap(): MetadataRoute.Sitemap {
  const items: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === "es" ? "" : `/${locale}`;
    const isDefault = locale === "es";

    items.push({
      url: `${BASE_URL}${prefix || "/"}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: isDefault ? 1 : 0.9,
      images: ["https://www.guillem.pm/logo.webp"],
      alternates: {
        languages: {
          es: "https://www.guillem.pm",
          en: "https://www.guillem.pm/en",
          ca: "https://www.guillem.pm/ca",
          "x-default": "https://www.guillem.pm",
        },
      },
    });

    items.push({
      url: `${BASE_URL}${prefix}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: ["https://www.guillem.pm/logo.webp"],
      alternates: {
        languages: {
          es: "https://www.guillem.pm/contact",
          en: "https://www.guillem.pm/en/contact",
          ca: "https://www.guillem.pm/ca/contact",
          "x-default": "https://www.guillem.pm/contact",
        },
      },
    });
  }

  return items;
}