"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Search,
  Heart,
  UserRound,
  ShoppingBag,
  Menu,
  ArrowUpRight,
} from "lucide-react";
import type { Category } from "@/domain/catalog";
import { useCommerce } from "./commerce-provider";
import { useShopping } from "@/services/shopping-store";
import { queryCatalog } from "@/services/catalog-query";
import { Dialog } from "./ui/dialog";
export function Navigation({ categories }: { categories: Category[] }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const { products, openCart } = useCommerce();
  const { state } = useShopping();
  const wishlistCount = state.wishlist.length;
  const cartCount = state.cart.reduce((sum, row) => sum + row.quantity, 0);
  const results = queryCatalog(products, { query }).slice(0, 4);
  return (
    <>
      <header className="site-header">
        <nav className="site-container nav-row" aria-label="Main navigation">
          <div className="reference-nav-left">
            <button
              className="reference-shop"
              aria-label="Open menu"
              onClick={() => setMenu(true)}
            >
              <Menu size={17} />
              <span>Shop</span>
            </button>
            <button
              className="reference-search"
              aria-label="Search"
              onClick={() => setSearch(true)}
            >
              <Search size={17} />
              <span>Search</span>
            </button>
          </div>{" "}
          <Link className="wordmark" href="/" aria-label="Styleco home">
            styleco<span>®</span>
          </Link>
          <div className="nav-utilities">
            <Link className="nav-contact" href="/contact">
              Contact us
            </Link>{" "}
            <Link
              className="icon-button wishlist-utility"
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} saved items`}
            >
              <Heart size={21} />
              {wishlistCount > 0 && (
                <span className="wishlist-count" aria-hidden="true">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              className="icon-button optional-utility"
              href="/account"
              aria-label="Account"
            >
              <UserRound size={21} />
            </Link>
            <button
              className="icon-button bag-button"
              aria-label={`Bag, ${cartCount} items`}
              onClick={openCart}
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="bag-count" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>
      <Dialog open={menu} onClose={() => setMenu(false)} title="Shop" drawer>
        <div className="drawer-content">
          <nav className="drawer-nav" aria-label="Shop menu">
            <p className="drawer-section-label">Shop by category</p>
            {[
              { id: "new", name: "New Arrivals", href: "/new-arrivals" },
              ...categories.map((c) => ({ ...c, href: `/category/${c.slug}` })),
              { id: "sale", name: "Sale", href: "/sale" },
            ].map((c) => (
              <Link href={c.href} onClick={() => setMenu(false)} key={c.id}>
                {c.name}
                <ArrowUpRight size={20} />
              </Link>
            ))}
          </nav>
          <div className="drawer-utilities">
            <p className="drawer-section-label">More from Styleco</p>
            <div className="drawer-utility-grid">
              <Link onClick={() => setMenu(false)} href="/wishlist">
                Wishlist <ArrowUpRight size={16} />
              </Link>
              <Link onClick={() => setMenu(false)} href="/account">
                My account <ArrowUpRight size={16} />
              </Link>
              <Link onClick={() => setMenu(false)} href="/about">
                Our story <ArrowUpRight size={16} />
              </Link>
              <Link onClick={() => setMenu(false)} href="/contact">
                Contact us <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={search}
        onClose={() => setSearch(false)}
        title="Looking for something?"
      >
        <form
          action="/search"
          onSubmit={() => setSearch(false)}
          className="search-form"
        >
          <Search size={23} />
          <label className="sr-only" htmlFor="search-overlay">
            Search products
          </label>
          <input
            id="search-overlay"
            name="q"
            placeholder="Try ‘cotton’, ‘katua’, or ‘blue’"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          <button className="icon-button" aria-label="View search results">
            <ArrowUpRight />
          </button>
        </form>
        <p className="text-eyebrow search-label">
          {query
            ? `${queryCatalog(products, { query }).length} MATCHES`
            : "A FEW GOOD PLACES TO START"}
        </p>
        <div className="search-results">
          {results.map((p) => (
            <Link
              href={`/products/${p.slug}`}
              onClick={() => setSearch(false)}
              key={p.id}
            >
              <Image
                src={p.images[0]!.url}
                alt={p.images[0]!.alt}
                width={72}
                height={90}
              />
              <span>
                {p.name}
                <small>{p.categoryIds[0]}</small>
              </span>
              <ArrowUpRight size={18} />
            </Link>
          ))}
          {results.length === 0 && (
            <p>No matches just yet. Try a category or a simpler search.</p>
          )}
        </div>
      </Dialog>
    </>
  );
}
