export const locales = ["en", "es", "ca"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export type CertificationId = "ab731" | "googleAiPro";
export type SecondaryBadgeId =
  | "googleAiFundamentals"
  | "googleAiAppBuilding"
  | "googleAiBrainstorming"
  | "googleAiContentCreation"
  | "googleAiDataAnalysis"
  | "googleAiResearch"
  | "googleAiWriting";

export type Messages = {
  nav: {
    about: string;
    blog: string;
    contact: string;
    connect: string;
  };
  hero: {
    name: string;
    headline: string;
    subline: string;
  };
  cta: {
    hero: string;
    blog: string;
    contact: string;
    viewAllPosts: string;
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  focus: {
    title: string;
    areas: [
      { title: string; text: string },
      { title: string; text: string },
      { title: string; text: string },
      { title: string; text: string },
    ];
  };
  certifications: {
    title: string;
    subtitle: string;
    comingSoon: string;
    moreOnTheWay: string;
    issued: string;
    credentialId: string;
    viewCredential: string;
    secondaryTitle: string;
    items: Record<
      CertificationId,
      { title: string; issuer: string; description: string }
    >;
    secondaryItems: Record<SecondaryBadgeId, { title: string; issuer: string }>;
  };
  blog: {
    title: string;
    subtitle: string;
    empty: string;
    readMore: string;
    backToBlog: string;
    latestTitle: string;
  };
  contact: {
    title: string;
    body: string;
    linkedInTitle: string;
    linkedInBody: string;
    linkedInCta: string;
    backHome: string;
  };
  notFound: {
    code: string;
    title: string;
    body: string;
    backHome: string;
    viewBlog: string;
  };
  footer: { line: string; source: string };
};
