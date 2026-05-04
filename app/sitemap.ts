import { MetadataRoute } from "next";

const BASE_URL = "https://www.guillem.pm";

const HREFLANG_URLS = {
  es: "https://www.guillem.pm",
  en: "https://www.guillem.pm/en",
  ca: "https://www.guillem.pm/ca",
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: ["https://www.guillem.pm/logo.webp"],
      alternates: {
        languages: {
          es: HREFLANG_URLS.es,
          en: HREFLANG_URLS.en,
          ca: HREFLANG_URLS.ca,
          "x-default": HREFLANG_URLS.es,
        },
      },
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: ["https://www.guillem.pm/logo.webp"],
      alternates: {
        languages: {
          es: `${HREFLANG_URLS.es}/contact`,
          en: `${HREFLANG_URLS.en}/contact`,
          ca: `${HREFLANG_URLS.ca}/contact`,
          "x-default": `${HREFLANG_URLS.es}/contact`,
        },
      },
    },
  ];
}