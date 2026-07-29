import type { Locale } from "@/lib/i18n/types";

export type BlogPostMeta = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};
