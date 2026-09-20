import { localAssetPath } from "@/config/site";
import type { AdminMediaAsset, AdminMediaSlot } from "@/domain/admin";
import type { HomepageContent } from "@/domain/homepage";

export interface AdminHomepageImageSlot {
  id: string;
  slot: Exclude<
    AdminMediaSlot,
    "category" | "product-card" | "product-gallery" | "campaign"
  >;
  label: string;
}

export const ADMIN_HOMEPAGE_IMAGE_SLOTS: AdminHomepageImageSlot[] = [
  {
    id: "homepage-sale-banner",
    slot: "homepage-sale-banner",
    label: "Explore Current Sale",
  },
  {
    id: "homepage-favorite",
    slot: "homepage-favorite",
    label: "Find your next favorite",
  },
  {
    id: "homepage-katua",
    slot: "homepage-katua",
    label: "The Katua Collection",
  },
  {
    id: "homepage-slow-morning",
    slot: "homepage-slow-morning",
    label: "Made for slow mornings",
  },
  {
    id: "homepage-brand",
    slot: "homepage-brand",
    label: "Behind The Brand",
  },
];

export function createHomepageMediaAssets(
  content: HomepageContent,
): AdminMediaAsset[] {
  const katua = content.campaigns[0];
  const slowMorning = content.campaigns[1];

  return [
    {
      id: "homepage-sale-banner",
      url: content.hero.image,
      alt: content.hero.alt,
      slot: "homepage-sale-banner",
      status: "published",
      source: "fixture",
    },
    {
      id: "homepage-favorite",
      url: localAssetPath("/images/shirt.webp"),
      alt: "Relaxed shirt from the seasonal edit",
      slot: "homepage-favorite",
      status: "published",
      source: "fixture",
    },
    {
      id: "homepage-katua",
      url: katua?.image ?? localAssetPath("/images/katua.webp"),
      alt: katua?.alt ?? "Ivory cotton Katua in warm natural light",
      slot: "homepage-katua",
      status: "published",
      source: "fixture",
    },
    {
      id: "homepage-slow-morning",
      url: slowMorning?.image ?? localAssetPath("/images/sleepwear.webp"),
      alt: slowMorning?.alt ?? "Sky blue cotton sleep set for slow mornings",
      slot: "homepage-slow-morning",
      status: "published",
      source: "fixture",
    },
    {
      id: "homepage-brand",
      url: localAssetPath("/images/katua.webp"),
      alt: "Styleco cotton Katua, designed for everyday comfort",
      slot: "homepage-brand",
      status: "published",
      source: "fixture",
    },
  ];
}
