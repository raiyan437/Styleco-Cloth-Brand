import type { Product } from "../domain/catalog";
import type { CartItem } from "../domain/commerce";

export function stockFor(products: Product[], variantId: string) {
  const variant = products
    .flatMap((p) => p.variants)
    .find((v) => v.id === variantId);
  return variant?.inStock ? (variant.stock ?? 1) : 0;
}
export function normalizeCart(
  cart: CartItem[],
  products: Product[],
): CartItem[] {
  const merged = new Map<string, CartItem>();
  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId);
    if (
      !product?.variants.some((v) => v.id === item.variantId) ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    )
      continue;
    const quantity = Math.min(
      stockFor(products, item.variantId),
      (merged.get(item.variantId)?.quantity ?? 0) + item.quantity,
    );
    if (quantity > 0) merged.set(item.variantId, { ...item, quantity });
  }
  return [...merged.values()];
}
export function setCartQuantity(
  cart: CartItem[],
  item: CartItem,
  products: Product[],
) {
  return normalizeCart(
    [...cart.filter((row) => row.variantId !== item.variantId), item],
    products,
  );
}
export function validateCoupon(code: string) {
  return code.trim().toUpperCase() === "STYLE10";
}
export function cartTotals(
  cart: CartItem[],
  products: Product[],
  coupon = "",
  delivery: "standard" | "express" = "standard",
) {
  const items = normalizeCart(cart, products);
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      products
        .find((p) => p.id === item.productId)!
        .variants.find((v) => v.id === item.variantId)!.price.amount *
        item.quantity,
    0,
  );
  const discount = validateCoupon(coupon) ? Math.round(subtotal / 10) : 0;
  const shipping = !subtotal
    ? 0
    : delivery === "express"
      ? 15000
      : subtotal >= 300000
        ? 0
        : 8000;
  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
  };
}
