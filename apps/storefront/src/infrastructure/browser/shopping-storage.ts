import { z } from "zod";
import type { ShoppingState, DemoOrder } from "../../domain/commerce";

export const shoppingSchema = z.object({
  cart: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive().max(99),
      }),
    )
    .max(100),
  wishlist: z.array(z.string()).max(100),
  coupon: z.string().max(30),
});
export const emptyShopping: ShoppingState = {
  cart: [],
  wishlist: [],
  coupon: "",
};
export function decodeShopping(raw: string | null): ShoppingState {
  try {
    const parsed = shoppingSchema.safeParse(JSON.parse(raw ?? "null"));
    return parsed.success
      ? { ...parsed.data, wishlist: [...new Set(parsed.data.wishlist)] }
      : emptyShopping;
  } catch {
    return emptyShopping;
  }
}
export const shoppingStorage = {
  read() {
    try {
      return decodeShopping(localStorage.getItem("styleco-shopping-v1"));
    } catch {
      return emptyShopping;
    }
  },
  write(state: ShoppingState) {
    try {
      localStorage.setItem("styleco-shopping-v1", JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  },
};
const orderSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  items: shoppingSchema.shape.cart,
  subtotal: z.number().int().nonnegative(),
  discount: z.number().int().nonnegative(),
  shipping: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  address: z.object({
    fullName: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
  payment: z.enum(["cod", "card"]),
});
let memoryOrder: DemoOrder | null = null;
export const orderStorage = {
  write(order: DemoOrder) {
    memoryOrder = order;
    try {
      sessionStorage.setItem("styleco-order-v1", JSON.stringify(order));
    } catch {
      /* memory fallback */
    }
  },
  read(): DemoOrder | null {
    try {
      const result = orderSchema.safeParse(
        JSON.parse(sessionStorage.getItem("styleco-order-v1") ?? "null"),
      );
      return result.success ? result.data : memoryOrder;
    } catch {
      return memoryOrder;
    }
  },
};
