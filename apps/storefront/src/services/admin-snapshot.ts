import "server-only";
import type {
  AdminActivity,
  AdminMediaAsset,
  AdminOrder,
  AdminSnapshot,
} from "@/domain/admin";
import { createHomepageMediaAssets } from "./admin-media";
import { getServices } from "./container";

const starterOrders: AdminOrder[] = [
  {
    id: "SC-1048",
    customer: "Nadia Rahman",
    status: "processing",
    itemCount: 2,
    total: 548000,
    createdAt: "2026-09-19",
  },
  {
    id: "SC-1047",
    customer: "Arif Hasan",
    status: "shipped",
    itemCount: 1,
    total: 249000,
    createdAt: "2026-09-18",
  },
];

const starterActivity: AdminActivity[] = [
  {
    id: "activity-seed-1",
    action: "Workspace created",
    entity: "System",
    detail: "Admin frontend demo initialized",
    createdAt: "2026-09-20T08:00:00.000Z",
  },
];

function mediaFromSnapshot(
  categories: Awaited<
    ReturnType<ReturnType<typeof getServices>["catalog"]["getCategories"]>
  >,
  products: Awaited<
    ReturnType<ReturnType<typeof getServices>["catalog"]["getProducts"]>
  >,
  content: Awaited<
    ReturnType<ReturnType<typeof getServices>["homepage"]["getContent"]>
  >,
): AdminMediaAsset[] {
  const assets = new Map<string, AdminMediaAsset>();
  for (const category of categories) {
    if (!category.image) continue;
    assets.set(`category-${category.id}`, {
      id: `category-${category.id}`,
      url: category.image.url,
      alt: category.image.alt,
      slot: "category",
      status: "published",
      source: "fixture",
    });
  }
  for (const product of products) {
    const image = product.images[0];
    if (!image) continue;
    assets.set(`product-${product.id}`, {
      id: `product-${product.id}`,
      url: image.url,
      alt: image.alt,
      slot: "product-card",
      status: "published",
      source: "fixture",
    });
  }
  for (const asset of createHomepageMediaAssets(content)) {
    assets.set(asset.id, asset);
  }
  return [...assets.values()];
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const services = getServices();
  const [categories, products, homepageContent, homepageSections] =
    await Promise.all([
      services.catalog.getCategories(),
      services.catalog.getProducts(),
      services.homepage.getContent(),
      services.homepage.getSections(),
    ]);

  const statuses: AdminSnapshot["statuses"] = {};
  for (const category of categories)
    statuses[`category:${category.id}`] = "published";
  for (const product of products)
    statuses[`product:${product.id}`] = "published";
  for (const section of homepageSections)
    statuses[`section:${section.id}`] = "published";

  return {
    categories,
    products,
    homepageContent,
    homepageSections: homepageSections.map((section) =>
      section.kind === "curated-products"
        ? {
            id: section.id,
            title: section.title,
            kind: section.kind,
            enabled: section.enabled,
            position: section.position,
            products: section.products,
          }
        : section,
    ),
    settings: {
      storeName: "Styleco",
      announcement: homepageContent.announcement,
      seoTitle: "Styleco — Good clothes. Great days.",
      seoDescription:
        "Considered clothing for your everyday. Discover shirts, Katua, tees, pants and sleepwear from Styleco.",
      deliveryNote: "Free standard delivery on orders ৳3,000+",
    },
    media: mediaFromSnapshot(categories, products, homepageContent),
    orders: starterOrders,
    activity: starterActivity,
    statuses,
    updatedAt: new Date().toISOString(),
  };
}
