export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Optional short editorial label shown beneath the category image. */
  editorialLabel?: string;
  image?: ProductImage;
  position: number;
}

/** Monetary amounts are integer minor units; currency is an ISO 4217 code. */
export interface Price {
  amount: number;
  currency: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: { name: string; hex: string };
  price: Price;
  originalPrice?: Price;
  inStock: boolean;
  stock?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryIds: string[];
  /** Primary image first, optional secondary hover image second. */
  images: ProductImage[];
  /** Optional image sets keyed by the selected color name. */
  colorImages?: Record<string, ProductImage[]>;
  variants: ProductVariant[];
  isNew?: boolean;
  description?: string;
  material?: string;
  fit?: string;
  care?: string;
  keywords?: string[];
  releasedAt?: string;
  rating?: number;
  reviewCount?: number;
}
