"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useShopping } from "@/services/shopping-store";
import { orderStorage } from "@/infrastructure/browser/shopping-storage";
import { money } from "@/services/catalog-query";
const subscribe = () => () => {};
export function Account() {
  const [tab, setTab] = useState("Overview");
  const { state } = useShopping();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const order = mounted ? orderStorage.read() : null;
  return (
    <div className="account-layout">
      <nav aria-label="Account sections">
        {["Overview", "Orders", "Addresses"].map((item) => (
          <button
            className={tab === item ? "selected" : ""}
            onClick={() => setTab(item)}
            key={item}
          >
            {item}
            <ArrowUpRight size={17} />
          </button>
        ))}
        <Link href="/wishlist">
          Wishlist ({state.wishlist.length})<ArrowUpRight size={17} />
        </Link>
      </nav>
      <section className="account-panel">
        <p className="text-eyebrow">DEMO ACCOUNT · NO SIGN-IN REQUIRED</p>
        <h2>
          {tab === "Overview"
            ? "Hey, good taste."
            : tab === "Orders"
              ? "Your good choices."
              : "Places you call home."}
        </h2>
        {tab === "Overview" ? (
          <>
            <p>
              This is your Styleco account preview. Profile details below are
              illustrative.
            </p>
            <div className="profile-preview">
              <span>Alex Rahman</span>
              <span>alex@example.com</span>
            </div>
            <Link href="/login" className="text-cta">
              Explore the sign-in screen <ArrowUpRight size={18} />
            </Link>
          </>
        ) : tab === "Orders" ? (
          order ? (
            <div>
              <p>Latest demo order: {order.id}</p>
              <p>Total: {money(order.total)}</p>
              <Link href="/order-confirmation" className="underlined">
                View confirmation
              </Link>
            </div>
          ) : (
            <p>
              Your demo orders will appear here after checkout. No real order
              history is connected.
            </p>
          )
        ) : (
          <p>
            Example address
            <br />
            Alex Rahman
            <br />
            House 12, Road 5, Dhanmondi
            <br />
            Dhaka 1209
            <br />
            <small>
              Illustrative profile only. Shipping entered at checkout stays with
              that session’s confirmation.
            </small>
          </p>
        )}
      </section>
    </div>
  );
}
