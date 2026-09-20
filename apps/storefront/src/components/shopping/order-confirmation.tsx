"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowUpRight } from "lucide-react";
import { orderStorage } from "@/infrastructure/browser/shopping-storage";
import { useCommerce } from "../commerce-provider";
import { imageForVariant, money } from "@/services/catalog-query";
import { EmptyState } from "../ui/shared";
const subscribe = () => () => {};
export function OrderConfirmation() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { products } = useCommerce();
  if (!mounted) return <p>Opening your confirmation…</p>;
  const order = orderStorage.read();
  if (!order)
    return (
      <EmptyState
        title="Your next good day starts here."
        description="Place an order to see your confirmation here."
      />
    );
  return (
    <div className="confirmation">
      <div className="confirmation-icon">
        <Check size={32} />
      </div>
      <p className="text-eyebrow">ORDER {order.id}</p>
      <h1>
        Good choices.
        <br />
        Great taste.
      </h1>
      <p>
        Your order is confirmed. We’ll keep you updated as it makes its way to
        you.
      </p>
      <div className="confirmation-details">
        <div>
          <h2>The details</h2>
          <p>
            {order.address.fullName}
            <br />
            {order.address.address}
            <br />
            {order.address.city} {order.address.postalCode}
          </p>
          <p>{order.payment === "cod" ? "Cash on Delivery" : "Card payment"}</p>
        </div>
        <div>
          <h2>Your edit</h2>
          {order.items.map((item) => {
            const p = products.find((p) => p.id === item.productId);
            const v = p?.variants.find((v) => v.id === item.variantId);
            const image = p && v ? imageForVariant(p, v) : undefined;
            return p && v ? (
              <div className="confirmation-item" key={item.variantId}>
                <Image
                  src={image!.url}
                  alt={image!.alt}
                  width={50}
                  height={64}
                />
                <span>
                  {p.name}
                  <small>
                    {v.color?.name} / {v.size} × {item.quantity}
                  </small>
                </span>
              </div>
            ) : null;
          })}
          <p className="confirmation-total">
            Total <strong>{money(order.total)}</strong>
          </p>
        </div>
      </div>
      <Link href="/new-arrivals" className="button">
        Keep finding favorites
        <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
