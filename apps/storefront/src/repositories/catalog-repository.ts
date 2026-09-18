import type { Category, Product } from "../domain/catalog";

export interface CatalogRepository {
  listProducts(): Promise<Product[]>;
  listCategories(): Promise<Category[]>;
  getProductsByIds(ids: readonly string[]): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
}
