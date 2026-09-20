import type { Product, ProductImage, ProductVariant } from "../domain/catalog";

export function displayVariant(product: Product): ProductVariant | undefined {
  return (
    product.variants.find((variant) => variant.inStock) ?? product.variants[0]
  );
}

export function imageForVariant(
  product: Product,
  variant?: ProductVariant,
): ProductImage | undefined {
  const color = variant?.color?.name;
  return (
    (color ? product.colorCardImages?.[color] : undefined) ??
    product.cardImage ??
    (color ? product.colorImages?.[color]?.[0] : undefined) ??
    product.images[0]
  );
}
export function isSale(product: Product) {
  return product.variants.some(
    (v) => (v.originalPrice?.amount ?? 0) > v.price.amount,
  );
}
export function colorsOf(product: Product) {
  return [
    ...new Map(
      product.variants
        .filter((v) => v.color)
        .map((v) => [v.color!.name, v.color!]),
    ).values(),
  ];
}
export const money = (amount: number) =>
  `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 }).format(amount / 100)}`;
export type SortOrder = "featured" | "newest" | "price-low" | "price-high";
export interface CatalogFilters {
  query?: string;
  size?: string;
  color?: string;
  maxPrice?: number;
  available?: boolean;
  sale?: boolean;
  sort?: SortOrder;
}
export function queryCatalog(products: Product[], filters: CatalogFilters) {
  const query = filters.query?.trim().toLowerCase() ?? "";
  const result = products.filter((product) => {
    if (
      query &&
      !`${product.name} ${product.categoryIds.join(" ")} ${product.keywords?.join(" ")}`
        .toLowerCase()
        .includes(query)
    )
      return false;
    if (filters.sale && !isSale(product)) return false;
    return product.variants.some(
      (v) =>
        (!filters.size || v.size === filters.size) &&
        (!filters.color || v.color?.name === filters.color) &&
        (!filters.maxPrice || v.price.amount <= filters.maxPrice) &&
        (!filters.available || v.inStock),
    );
  });
  if (filters.sort === "newest")
    result.sort((a, b) =>
      (b.releasedAt ?? "").localeCompare(a.releasedAt ?? ""),
    );
  if (filters.sort === "price-low")
    result.sort(
      (a, b) =>
        (displayVariant(a)?.price.amount ?? 0) -
        (displayVariant(b)?.price.amount ?? 0),
    );
  if (filters.sort === "price-high")
    result.sort(
      (a, b) =>
        (displayVariant(b)?.price.amount ?? 0) -
        (displayVariant(a)?.price.amount ?? 0),
    );
  return result;
}
