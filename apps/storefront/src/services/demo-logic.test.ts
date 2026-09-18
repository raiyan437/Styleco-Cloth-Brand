import { describe, it, expect } from "vitest";
import {
  products,
  categories,
  homepageSections,
} from "../infrastructure/mock/data";
import {
  mockCatalogRepository,
  mockHomepageRepository,
} from "../infrastructure/mock/repositories";
import { CatalogService } from "./catalog-service";
import { HomepageService } from "./homepage-service";
import { queryCatalog, displayVariant } from "./catalog-query";
import {
  cartTotals,
  normalizeCart,
  setCartQuantity,
  validateCoupon,
} from "./mock-commerce";
import { decodeShopping } from "../infrastructure/browser/shopping-storage";
import { checkoutSchema } from "./checkout-schema";

const product = products[0]!;
const variant = product.variants.find((v) => v.inStock)!;
const item = { productId: product.id, variantId: variant.id, quantity: 1 };
describe("catalog demo", () => {
  it("keeps categories ordered independently of repository order", async () => {
    const service = new CatalogService({
      ...mockCatalogRepository,
      async listCategories() {
        return categories.toReversed();
      },
    });
    expect((await service.getCategories()).map((c) => c.name)).toEqual([
      "Shirt",
      "Katua",
      "T-Shirt",
      "Pants",
      "Sleepwear",
    ]);
  });
  it("resolves explicit curated references without replacing them with release dates", async () => {
    const sections = await new HomepageService(
      mockHomepageRepository,
      mockCatalogRepository,
    ).getSections();
    for (const section of sections) {
      if (section.kind !== "curated-products") continue;
      const original = homepageSections.find((s) => s.id === section.id)!;
      expect(section.resolvedProducts.map((p) => p.id)).toEqual(
        original.kind === "curated-products"
          ? original.products.map((ref) => ref.productId)
          : [],
      );
    }
  });
  it("combines size/color/stock filters on the same variant", () => {
    const result = queryCatalog(products, {
      query: "Oxford",
      color: "Sky Blue",
      size: "L",
      available: true,
    });
    expect(result).toHaveLength(0);
    expect(
      queryCatalog(products, {
        query: "Oxford",
        color: "Sky Blue",
        size: "S",
        available: true,
      }),
    ).toHaveLength(1);
  });
  it("sorts prices without mutating fixtures", () => {
    const before = products.map((p) => p.id);
    const result = queryCatalog(products, { sort: "price-low" });
    expect(result.map((p) => displayVariant(p)!.price.amount)).toEqual(
      result
        .map((p) => displayVariant(p)!.price.amount)
        .toSorted((a, b) => a - b),
    );
    expect(products.map((p) => p.id)).toEqual(before);
  });
  it("finds keywords and has an empty state", () => {
    expect(queryCatalog(products, { query: "linen" }).length).toBeGreaterThan(
      0,
    );
    expect(queryCatalog(products, { query: "unknown-catalog-piece" })).toEqual(
      [],
    );
  });
});
describe("stock and money", () => {
  it("caps quantity to stock and merges duplicate rows", () => {
    expect(normalizeCart([{ ...item, quantity: 99 }, item], products)).toEqual([
      { ...item, quantity: variant.stock },
    ]);
  });
  it("rejects sold-out and foreign variants", () => {
    const sold = product.variants.find((v) => !v.inStock)!;
    expect(
      normalizeCart(
        [
          { ...item, variantId: sold.id },
          { ...item, productId: "wrong" },
        ],
        products,
      ),
    ).toEqual([]);
  });
  it("removes zero quantities and refuses fractional quantities", () => {
    expect(setCartQuantity([item], { ...item, quantity: 0 }, products)).toEqual(
      [],
    );
    expect(normalizeCart([{ ...item, quantity: 1.5 }], products)).toEqual([]);
  });
  it("calculates discount and delivery in integer paisa", () => {
    const totals = cartTotals([item], products, "style10");
    expect(totals).toEqual({
      subtotal: 249000,
      discount: 24900,
      shipping: 8000,
      total: 232100,
    });
    expect(
      cartTotals([{ ...item, quantity: 2 }], products, "STYLE10").shipping,
    ).toBe(0);
    expect(cartTotals([item], products, "STYLE10", "express").shipping).toBe(
      15000,
    );
    expect(validateCoupon("bogus")).toBe(false);
  });
});
describe("browser persistence and checkout", () => {
  it("recovers malformed storage and deduplicates saved products", () => {
    expect(decodeShopping("broken").cart).toEqual([]);
    expect(
      decodeShopping(
        JSON.stringify({
          cart: [{ ...item, quantity: -2 }],
          wishlist: [],
          coupon: "",
        }),
      ).cart,
    ).toEqual([]);
    expect(
      decodeShopping(
        JSON.stringify({
          cart: [item],
          wishlist: ["shirt-1", "shirt-1"],
          coupon: "STYLE10",
        }),
      ),
    ).toEqual({ cart: [item], wishlist: ["shirt-1"], coupon: "STYLE10" });
  });
  it("rejects empty checkout and real card numbers", () => {
    expect(checkoutSchema.safeParse({}).success).toBe(false);
    const values = {
      email: "alex@example.com",
      phone: "01712345678",
      fullName: "Alex Rahman",
      address: "House 12, Road 5",
      city: "Dhaka",
      postalCode: "1209",
      delivery: "standard",
      payment: "card",
    };
    expect(
      checkoutSchema.safeParse({ ...values, cardNumber: "1234567890123456" })
        .success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...values, cardNumber: "4242 4242 4242 4242" })
        .success,
    ).toBe(true);
  });
});
