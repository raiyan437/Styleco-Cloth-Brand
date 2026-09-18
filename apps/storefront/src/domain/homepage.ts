export interface CuratedProductReference {
  productId: string;
  position: number;
}

export interface CampaignContent {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  cta: string;
}

export interface HomepageContent {
  announcement: string;
  hero: CampaignContent;
  campaigns: CampaignContent[];
  promotion: {
    eyebrow: string;
    title: string;
    cta: string;
    href: string;
    stamp: string;
  };
}

interface SectionBase {
  id: string;
  title: string;
  enabled: boolean;
  position: number;
}

export type HomepageSection =
  | (SectionBase & { kind: "categories" })
  | (SectionBase & {
      kind: "curated-products";
      products: CuratedProductReference[];
    });
