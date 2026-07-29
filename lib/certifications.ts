import type { CertificationId, SecondaryBadgeId } from "@/lib/i18n/types";

export type CertificationMeta = {
  badgeSrc: string;
  badgeAlt: string;
  credentialUrl: string;
  issuedAt: string;
  credentialId?: string;
};

export const certificationMeta: Record<CertificationId, CertificationMeta> = {
  googleAiPro: {
    badgeSrc: "/images/cert-google-ai-pro.png",
    badgeAlt: "Google AI Professional Certificate badge",
    credentialUrl:
      "https://www.credly.com/badges/6aafe383-20c3-4e96-901a-1669aab8eb05/public_url",
    credentialId: "6aafe383-20c3-4e96-901a-1669aab8eb05",
    issuedAt: "2026-07",
  },
  ab731: {
    badgeSrc: "/images/cert-ab731.svg",
    badgeAlt: "Microsoft Certified: AI Transformation Leader badge",
    credentialUrl:
      "https://learn.microsoft.com/api/credentials/share/en-us/GuillemPM/D01B9549D2213BEF?sharingId=D33E1C84EB802729",
    issuedAt: "2026-07",
    credentialId: "D01B9549D2213BEF",
  },
};

export const certificationOrder: CertificationId[] = ["ab731", "googleAiPro"];

export type SecondaryBadgeMeta = {
  badgeSrc: string;
  badgeAlt: string;
  credentialUrl: string;
};

export const secondaryBadgeMeta: Record<SecondaryBadgeId, SecondaryBadgeMeta> = {
  googleAiFundamentals: {
    badgeSrc: "/images/cert-google-ai-fundamentals.webp",
    badgeAlt: "Google AI Fundamentals badge",
    credentialUrl:
      "https://www.credly.com/badges/f9fb8d9e-f59c-4a5e-865f-f42f3d61b8ea/public_url",
  },
  googleAiAppBuilding: {
    badgeSrc: "/images/cert-google-ai-app-building.webp",
    badgeAlt: "Google AI for App Building badge",
    credentialUrl:
      "https://www.credly.com/badges/bc86371a-5d75-4a77-862b-98f59d7bb257/public_url",
  },
  googleAiBrainstorming: {
    badgeSrc: "/images/cert-google-ai-brainstorming.webp",
    badgeAlt: "Google AI for Brainstorming and Planning badge",
    credentialUrl:
      "https://www.credly.com/badges/6dc32d90-7c3c-40db-965b-b5e017fe1f03/public_url",
  },
  googleAiContentCreation: {
    badgeSrc: "/images/cert-google-ai-content-creation.webp",
    badgeAlt: "Google AI for Content Creation badge",
    credentialUrl:
      "https://www.credly.com/badges/4b84265e-804a-4e51-912b-12d8f6ac24ab/public_url",
  },
  googleAiDataAnalysis: {
    badgeSrc: "/images/cert-google-ai-data-analysis.webp",
    badgeAlt: "Google AI for Data Analysis badge",
    credentialUrl:
      "https://www.credly.com/badges/dac98d67-fd4e-4161-8dcc-e2d0b2f03583/public_url",
  },
  googleAiResearch: {
    badgeSrc: "/images/cert-google-ai-research.webp",
    badgeAlt: "Google AI for Research and Insights badge",
    credentialUrl:
      "https://www.credly.com/badges/94fde120-7002-4a59-bb7c-af11ae87dd8d/public_url",
  },
  googleAiWriting: {
    badgeSrc: "/images/cert-google-ai-writing.webp",
    badgeAlt: "Google AI for Writing and Communicating badge",
    credentialUrl:
      "https://www.credly.com/badges/1a844c99-ddb5-4100-a9ac-16afe1779902/public_url",
  },
};

export const secondaryBadgeOrder: SecondaryBadgeId[] = [
  "googleAiFundamentals",
  "googleAiAppBuilding",
  "googleAiBrainstorming",
  "googleAiContentCreation",
  "googleAiDataAnalysis",
  "googleAiResearch",
  "googleAiWriting",
];
