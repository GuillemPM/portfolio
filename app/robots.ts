import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/chat", "/schedule"],
      },
    ],
    sitemap: "https://www.guillem.pm/sitemap.xml",
    host: "https://www.guillem.pm",
  };
}