import type { CatalogRepository } from "../repositories/catalog-repository";
import type { HomepageRepository } from "../repositories/homepage-repository";

export class HomepageService {
  constructor(
    private readonly homepage: HomepageRepository,
    private readonly catalog: CatalogRepository,
  ) {}

  getContent() {
    if (!this.homepage.getContent)
      throw new Error("Homepage content is unavailable.");
    return this.homepage.getContent();
  }

  async getSections() {
    const sections = (await this.homepage.listSections())
      .filter((section) => section.enabled)
      .toSorted((a, b) => a.position - b.position);

    return Promise.all(
      sections.map(async (section) => {
        if (section.kind === "categories") return section;
        const references = section.products.toSorted(
          (a, b) => a.position - b.position,
        );
        const products = await this.catalog.getProductsByIds(
          references.map((item) => item.productId),
        );
        const byId = new Map(products.map((product) => [product.id, product]));
        return {
          ...section,
          products: references,
          // Preserve curated order even when the storage query returns another order.
          resolvedProducts: references.flatMap((reference) => {
            const product = byId.get(reference.productId);
            return product ? [product] : [];
          }),
        };
      }),
    );
  }
}
