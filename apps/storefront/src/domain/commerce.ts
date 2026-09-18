export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
export interface DemoOrder {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
  };
  payment: "cod" | "card";
}
export interface ShoppingState {
  cart: CartItem[];
  wishlist: string[];
  coupon: string;
}
