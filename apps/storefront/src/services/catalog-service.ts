import type { CatalogRepository } from "../repositories/catalog-repository";

export class CatalogService {
  constructor(private readonly catalog: CatalogRepository) {}

  async getCategories() {
    return (await this.catalog.listCategories()).toSorted(
      (a, b) => a.position - b.position,
    );
  }

  getProductBySlug(slug: string) {
    return this.catalog.getProductBySlug(slug);
  }

  getProducts() {
    return this.catalog.listProducts();
  }

  async getCategory(slug: string) {
    return (
      (await this.catalog.listCategories()).find(
        (category) => category.slug === slug,
      ) ?? null
    );
  }
}
