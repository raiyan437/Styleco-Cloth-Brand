"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Home,
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

function countLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function categoryLabel(category: string | undefined) {
  if (!category) return "Collection";
  if (category === "pant") return "Pants";
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

const SEARCH_HISTORY_KEY = "styleco-search-history-v1";
const popularSearches = [
  { label: "New arrivals", query: "new" },
  { label: "Shirts", query: "shirt" },
  { label: "Katua", query: "katua" },
  { label: "Blue", query: "blue" },
];

export function Navigation({ categories }: { categories: Category[] }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { products, openCart } = useCommerce();
  const { state } = useShopping();
  const wishlistCount = state.wishlist.length;
  const cartCount = state.cart.reduce((sum, row) => sum + row.quantity, 0);
  const searchActive = pathname === "/search";
  const hideMobileNavigation =
    pathname === "/checkout" ||
    pathname === "/order-confirmation" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/cart" ||
    pathname === "/wishlist" ||
    pathname === "/account" ||
    pathname === "/contact" ||
    pathname === "/about" ||
    pathname === "/faq" ||
    pathname === "/shipping-returns" ||
    pathname === "/size-guide" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/new-arrivals" ||
    pathname === "/sale" ||
    pathname === "/search" ||
    pathname.startsWith("/category/") ||
    pathname.startsWith("/products/");
  const searchMatches = useMemo(
    () => queryCatalog(products, { query }),
    [products, query],
  );
  const results = useMemo(() => searchMatches.slice(0, 4), [searchMatches]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    document.body.dataset.hideMobileNavigation = String(hideMobileNavigation);
    return () => {
      delete document.body.dataset.hideMobileNavigation;
    };
  }, [hideMobileNavigation]);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = JSON.parse(
          window.localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]",
        );
        setRecentSearches(
          Array.isArray(stored)
            ? stored.filter(
                (value): value is string =>
                  typeof value === "string" && value.trim().length > 0,
              )
            : [],
        );
      } catch {
        setRecentSearches([]);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  const rememberSearch = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    const next = [
      normalized,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== normalized.toLowerCase(),
      ),
    ].slice(0, 5);
    setRecentSearches(next);
    try {
      window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* Search still works when browser storage is unavailable. */
    }
  };
  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <nav className="site-container nav-row" aria-label="Main navigation">
          <div className="reference-nav-left">
            <button
              type="button"
              className="reference-shop"
              aria-label="Open menu"
              onClick={() => setMenu(true)}
            >
              <Menu size={17} />
              <span>Shop</span>
            </button>
            <button
              type="button"
              className={`reference-search${searchActive ? " is-active" : ""}`}
              data-active={searchActive}
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
            <Link
              className="nav-contact"
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
            >
              Contact us
            </Link>{" "}
            <Link
              className="icon-button wishlist-utility"
              href="/wishlist"
              aria-label={`Wishlist, ${countLabel(wishlistCount, "saved item")}`}
              aria-current={pathname === "/wishlist" ? "page" : undefined}
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
              aria-current={pathname === "/account" ? "page" : undefined}
            >
              <UserRound size={21} />
            </Link>
            <button
              className={`icon-button bag-button${pathname === "/cart" ? " is-active" : ""}`}
              data-active={pathname === "/cart"}
              aria-label={`Bag, ${countLabel(cartCount, "item")}`}
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
      <Dialog
        open={menu}
        onClose={() => setMenu(false)}
        title="Shop"
        drawer
        side="left"
      >
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
        className="search-dialog"
      >
        <form
          action="/search"
          onSubmit={() => {
            rememberSearch(query);
            setSearch(false);
          }}
          className="search-form"
        >
          <Search size={23} />
          <label className="sr-only" htmlFor="search-overlay">
            Search products
          </label>
          <input
            id="search-overlay"
            name="q"
            role="combobox"
            placeholder="Try ‘cotton’, ‘katua’, or ‘blue’"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveSearchIndex(-1);
            }}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={Boolean(query)}
            aria-activedescendant={
              activeSearchIndex >= 0
                ? `search-option-${activeSearchIndex}`
                : undefined
            }
            onKeyDown={(event) => {
              if (!query || results.length === 0) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveSearchIndex((index) =>
                  index < results.length - 1 ? index + 1 : 0,
                );
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveSearchIndex((index) =>
                  index > 0 ? index - 1 : results.length - 1,
                );
              }
              if (event.key === "Enter" && activeSearchIndex >= 0) {
                event.preventDefault();
                const selected = results[activeSearchIndex];
                if (!selected) return;
                rememberSearch(query);
                setSearch(false);
                router.push(`/products/${selected.slug}`);
              }
            }}
          />
          <button
            type="submit"
            className="icon-button"
            aria-label="View search results"
          >
            <ArrowUpRight />
          </button>
        </form>
        <p className="text-eyebrow search-label">
          {query
            ? `${searchMatches.length} MATCHES`
            : "A FEW GOOD PLACES TO START"}
        </p>
        <div
          className="search-results"
          id="search-suggestions"
          role={query ? "listbox" : undefined}
          aria-live="polite"
        >
          {!query && (
            <div className="search-suggestions">
              <div>
                <p className="search-suggestion-heading">Popular searches</p>
                <div className="search-suggestion-list">
                  {popularSearches.map((item) => (
                    <Link
                      key={item.query}
                      href={`/search?q=${item.query}`}
                      onClick={() => setSearch(false)}
                    >
                      {item.label}
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              </div>
              {recentSearches.length > 0 && (
                <div>
                  <p className="search-suggestion-heading">Recent searches</p>
                  <div className="search-suggestion-list search-recent-list">
                    {recentSearches.map((item) => (
                      <Link
                        key={item}
                        href={`/search?q=${encodeURIComponent(item)}`}
                        onClick={() => setSearch(false)}
                      >
                        {item}
                        <ArrowUpRight size={15} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {results.map((p, index) => (
            <Link
              id={`search-option-${index}`}
              role={query ? "option" : undefined}
              aria-selected={query ? index === activeSearchIndex : undefined}
              href={`/products/${p.slug}`}
              onClick={() => setSearch(false)}
              key={p.id}
            >
              <Image
                src={p.images[0]!.url}
                alt={p.images[0]!.alt}
                width={72}
                height={90}
                quality={75}
                sizes="72px"
              />
              <span>
                {p.name}
                <small>{categoryLabel(p.categoryIds[0])}</small>
              </span>
              <ArrowUpRight size={18} />
            </Link>
          ))}
          {results.length === 0 && (
            <p>No matches just yet. Try a category or a simpler search.</p>
          )}
        </div>
      </Dialog>
      <nav
        className="mobile-bottom-nav"
        aria-label="Quick navigation"
        data-hidden={hideMobileNavigation || undefined}
      >
        <Link
          href="/"
          className={pathname === "/" ? "is-active" : ""}
          aria-current={pathname === "/" ? "page" : undefined}
          aria-label="Home"
        >
          <Home size={19} />
          <span>Home</span>
        </Link>
        <button type="button" onClick={() => setMenu(true)} aria-label="Shop">
          <Menu size={19} />
          <span>Shop</span>
        </button>
        <button
          type="button"
          className={searchActive ? "is-active" : ""}
          data-active={searchActive}
          onClick={() => setSearch(true)}
          aria-label="Find products"
        >
          <Search size={19} />
          <span>Search</span>
        </button>
        <Link
          href="/wishlist"
          className={pathname === "/wishlist" ? "is-active" : ""}
          aria-current={pathname === "/wishlist" ? "page" : undefined}
          aria-label={`Wishlist tab, ${countLabel(wishlistCount, "saved item")}`}
        >
          <span className="mobile-nav-icon-wrap">
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="mobile-nav-count" aria-hidden="true">
                {wishlistCount}
              </span>
            )}
          </span>
          <span>Wishlist</span>
        </Link>
        <button
          type="button"
          className={pathname === "/cart" ? "is-active" : ""}
          data-active={pathname === "/cart"}
          onClick={openCart}
          aria-label={`View basket, ${countLabel(cartCount, "item")}`}
        >
          <span className="mobile-nav-icon-wrap">
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="mobile-nav-count" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </span>
          <span>Bag</span>
        </button>
      </nav>
    </>
  );
}
