"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import type { Product } from "@/domain/catalog";
import {
  colorsOf,
  queryCatalog,
  type CatalogFilters,
  type SortOrder,
  money,
  isSale,
} from "@/services/catalog-query";
import { useStorefrontCatalog } from "../storefront-catalog-provider";
import { ProductCard } from "./product-card";
import { Dialog } from "../ui/dialog";
import { EmptyState } from "../ui/shared";
import { StyledSelect } from "../ui/styled-select";

type ActiveFilter = {
  label: string;
  clear: () => void;
};

const ALL_PRODUCTS_SCOPE = { kind: "all" } as const;

function filtersFromUrl(search: string, fallbackQuery: string): CatalogFilters {
  const params = new URLSearchParams(search);
  const sort = params.get("sort");
  const parsedSort: SortOrder =
    sort === "newest" || sort === "price-low" || sort === "price-high"
      ? sort
      : "featured";
  const maxPrice = Number(params.get("max"));
  return {
    query: params.get("q") ?? fallbackQuery,
    size: params.get("size") || undefined,
    color: params.get("color") || undefined,
    maxPrice: maxPrice > 0 ? maxPrice : undefined,
    available: params.get("stock") === "1" || undefined,
    sale: params.get("sale") === "1" || undefined,
    sort: parsedSort,
  };
}

export function ProductListing({
  products,
  search = false,
  initialQuery = "",
  scope = ALL_PRODUCTS_SCOPE,
}: {
  products: Product[];
  search?: boolean;
  initialQuery?: string;
  scope?:
    | { kind: "all" }
    | { kind: "category"; categoryId: string }
    | { kind: "new" }
    | { kind: "sale" };
}) {
  const { products: publishedProducts, ready: catalogReady } =
    useStorefrontCatalog();
  const [filters, setFilters] = useState<CatalogFilters>({
    query: initialQuery,
    sort: "featured",
  });
  const [urlReady, setUrlReady] = useState(false);
  const [open, setOpen] = useState(false);
  const availableProducts = useMemo(() => {
    if (!catalogReady) return products;
    if (scope.kind === "category") {
      return publishedProducts.filter((product) =>
        product.categoryIds.includes(scope.categoryId),
      );
    }
    if (scope.kind === "new") {
      return publishedProducts.filter((product) => product.isNew);
    }
    if (scope.kind === "sale") return publishedProducts.filter(isSale);
    return publishedProducts;
  }, [catalogReady, products, publishedProducts, scope]);
  const results = useMemo(
    () => queryCatalog(availableProducts, filters),
    [availableProducts, filters],
  );
  const colors = useMemo(
    () => [
      ...new Set(
        availableProducts.flatMap((p) => colorsOf(p).map((c) => c.name)),
      ),
    ],
    [availableProducts],
  );
  const update = (value: Partial<CatalogFilters>) =>
    setFilters((previous) => ({ ...previous, ...value }));
  const clearFilters = () =>
    setFilters({ query: filters.query, sort: filters.sort });
  useEffect(() => {
    const syncFromUrl = () => {
      setFilters(filtersFromUrl(window.location.search, initialQuery));
    };
    const timeout = window.setTimeout(() => {
      syncFromUrl();
      setUrlReady(true);
    }, 0);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [initialQuery]);
  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams();
    if (filters.query?.trim()) params.set("q", filters.query.trim());
    if (filters.size) params.set("size", filters.size);
    if (filters.color) params.set("color", filters.color);
    if (filters.maxPrice) params.set("max", String(filters.maxPrice));
    if (filters.available) params.set("stock", "1");
    if (filters.sale) params.set("sale", "1");
    if (filters.sort && filters.sort !== "featured") {
      params.set("sort", filters.sort);
    }
    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [filters, urlReady]);
  const activeFilters: ActiveFilter[] = [];
  if (filters.size)
    activeFilters.push({
      label: `Size ${filters.size}`,
      clear: () => update({ size: undefined }),
    });
  if (filters.color)
    activeFilters.push({
      label: filters.color,
      clear: () => update({ color: undefined }),
    });
  if (filters.maxPrice)
    activeFilters.push({
      label: `Under ${money(filters.maxPrice)}`,
      clear: () => update({ maxPrice: undefined }),
    });
  if (filters.available)
    activeFilters.push({
      label: "In stock",
      clear: () => update({ available: undefined }),
    });
  if (filters.sale)
    activeFilters.push({
      label: "On sale",
      clear: () => update({ sale: undefined }),
    });
  const filterFields = (
    <div className="filter-fields">
      <fieldset>
        <legend>Size</legend>
        <div className="size-options">
          {["S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              className={filters.size === size ? "selected" : ""}
              onClick={() =>
                update({ size: filters.size === size ? undefined : size })
              }
              aria-pressed={filters.size === size}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>
      <StyledSelect
        className="field-label"
        label="Color"
        value={filters.color ?? ""}
        onChange={(value) => update({ color: value || undefined })}
        options={[
          { value: "", label: "All colors" },
          ...colors.map((color) => ({ value: color, label: color })),
        ]}
      />
      <StyledSelect
        className="field-label"
        label="Price range"
        value={String(filters.maxPrice ?? 0)}
        onChange={(value) => update({ maxPrice: Number(value) || undefined })}
        options={[
          { value: "0", label: "Any price" },
          ...[150000, 200000, 250000, 300000].map((value) => ({
            value: String(value),
            label: `Under ${money(value)}`,
          })),
        ]}
      />
      <label className="check-row">
        <input
          type="checkbox"
          checked={!!filters.available}
          onChange={(e) => update({ available: e.target.checked })}
        />
        In stock only
      </label>
      <label className="check-row">
        <input
          type="checkbox"
          checked={!!filters.sale}
          onChange={(e) => update({ sale: e.target.checked })}
        />
        On sale
      </label>
      <button className="text-cta" onClick={clearFilters}>
        Clear all filters <X size={16} />
      </button>
    </div>
  );
  return (
    <div className="listing">
      <div className="listing-toolbar">
        <div className="listing-count-row">
          <span aria-live="polite">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </span>
          {activeFilters.length > 0 && (
            <div className="active-filter-list" aria-label="Active filters">
              {activeFilters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  className="filter-chip"
                  aria-label={`Remove ${filter.label} filter`}
                  onClick={filter.clear}
                >
                  {filter.label} <X size={13} />
                </button>
              ))}
              <button
                type="button"
                className="clear-filter-button"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}
          <button
            type="button"
            className={`filter-trigger${activeFilters.length > 0 ? " is-active" : ""}`}
            aria-pressed={activeFilters.length > 0}
            onClick={() => setOpen(true)}
          >
            <SlidersHorizontal size={17} /> Filters
            {activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
          </button>
        </div>
        <StyledSelect
          className="sort-label"
          label="Sort by"
          value={filters.sort ?? "featured"}
          onChange={(value) => update({ sort: value as SortOrder })}
          options={[
            { value: "featured", label: "Featured" },
            { value: "newest", label: "Newest" },
            { value: "price-low", label: "Price: low to high" },
            { value: "price-high", label: "Price: high to low" },
          ]}
        />
      </div>
      {search && (
        <div className="search-form listing-search">
          <Search />
          <label className="sr-only" htmlFor="catalog-search">
            Search the collection
          </label>
          <input
            id="catalog-search"
            value={filters.query ?? ""}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Name, category or color…"
          />
        </div>
      )}
      <div className="listing-layout">
        <aside className="desktop-filters">
          <h2>Refine your edit</h2>
          {filterFields}
        </aside>
        <div>
          {results.length ? (
            <div className="product-grid">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <>
              <EmptyState
                title={
                  activeFilters.length > 0
                    ? "Nothing matches this edit."
                    : search
                      ? "No pieces found."
                      : "Nothing in this edit. Yet."
                }
                description={
                  activeFilters.length > 0
                    ? "Clear a filter or open the full collection to find your next favorite."
                    : search
                      ? "Try a simpler search, or explore the latest pieces instead."
                      : "Try a different color, size, or price range."
                }
                secondaryAction={
                  activeFilters.length > 0
                    ? { label: "Clear filters", onClick: clearFilters }
                    : undefined
                }
              />
              {search && (
                <div className="search-empty-suggestions">
                  <p className="text-eyebrow">Try starting with</p>
                  <div>
                    {[
                      ["Shirts", "shirt"],
                      ["Katua", "katua"],
                      ["T-shirts", "t-shirt"],
                      ["Blue", "blue"],
                    ].map(([label, query]) => (
                      <Link key={query} href={`/search?q=${query}`}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Refine your edit"
        drawer
      >
        {filterFields}
        <button className="button full-width" onClick={() => setOpen(false)}>
          Show {results.length} pieces
        </button>
      </Dialog>
    </div>
  );
}
