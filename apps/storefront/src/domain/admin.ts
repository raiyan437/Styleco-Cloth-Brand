import type { Category, Product } from "./catalog";
import type { HomepageContent, HomepageSection } from "./homepage";

export type AdminContentStatus =
  "draft" | "published" | "scheduled" | "archived";

export type AdminMediaSlot =
  | "category"
  | "product-card"
  | "product-gallery"
  | "campaign"
  | "homepage-sale-banner"
  | "homepage-favorite"
  | "homepage-katua"
  | "homepage-slow-morning"
  | "homepage-brand";

export interface AdminCrop {
  x: number;
  y: number;
  zoom: number;
  aspectRatio: number;
}

export interface AdminMediaAsset {
  id: string;
  url: string;
  alt: string;
  slot: AdminMediaSlot;
  status: AdminContentStatus;
  source: "fixture" | "upload";
  crop?: AdminCrop;
}

export interface AdminSettings {
  storeName: string;
  announcement: string;
  seoTitle: string;
  seoDescription: string;
  deliveryNote: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  itemCount: number;
  total: number;
  createdAt: string;
}

export interface AdminActivity {
  id: string;
  action: string;
  entity: string;
  detail: string;
  createdAt: string;
}

export interface AdminSnapshot {
  categories: Category[];
  products: Product[];
  homepageContent: HomepageContent;
  homepageSections: HomepageSection[];
  settings: AdminSettings;
  media: AdminMediaAsset[];
  orders: AdminOrder[];
  activity: AdminActivity[];
  statuses: Record<string, AdminContentStatus>;
  updatedAt: string;
}

export interface AdminSession {
  username: "admin";
  role: "admin";
  signedInAt: string;
}
