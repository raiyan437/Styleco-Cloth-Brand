"use client";
import { useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import type { Product } from "@/domain/catalog";
import {
  colorsOf,
  queryCatalog,
  type CatalogFilters,
  type SortOrder,
  money,
} from "@/services/catalog-query";
import { ProductCard } from "./product-card";
import { Dialog } from "../ui/dialog";
import { EmptyState } from "../ui/shared";

export function ProductListing({
  products,
  search = false,
  initialQuery = "",
}: {
  products: Product[];
  search?: boolean;
  initialQuery?: string;
}) {
  const [filters, setFilters] = useState<CatalogFilters>({
    query: initialQuery,
    sort: "featured",
  });
  const [open, setOpen] = useState(false);
  const results = queryCatalog(products, filters);
  const colors = [
    ...new Set(products.flatMap((p) => colorsOf(p).map((c) => c.name))),
  ];
  const active = [
    filters.size,
    filters.color,
    filters.maxPrice,
    filters.available,
    filters.sale,
  ].filter(Boolean).length;
  const update = (value: Partial<CatalogFilters>) =>
    setFilters((previous) => ({ ...previous, ...value }));
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
      <label className="field-label">
        Color
        <select
          value={filters.color ?? ""}
          onChange={(e) => update({ color: e.target.value || undefined })}
        >
          <option value="">All colors</option>
          {colors.map((color) => (
            <option key={color}>{color}</option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Price range
        <select
          value={filters.maxPrice ?? 0}
          onChange={(e) =>
            update({ maxPrice: Number(e.target.value) || undefined })
          }
        >
          <option value={0}>Any price</option>
          {[150000, 200000, 250000, 300000].map((value) => (
            <option key={value} value={value}>
              Under {money(value)}
            </option>
          ))}
        </select>
      </label>
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
      <button
        className="text-cta"
        onClick={() => setFilters({ query: filters.query, sort: filters.sort })}
      >
        Clear all filters <X size={16} />
      </button>
    </div>
  );
  return (
    <div className="listing">
      <div className="listing-toolbar">
        <div>
          <span aria-live="polite">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </span>
          <button className="filter-trigger" onClick={() => setOpen(true)}>
            <SlidersHorizontal size={17} /> Filters{" "}
            {active > 0 ? `(${active})` : ""}
          </button>
        </div>
        <label className="sort-label">
          Sort by{" "}
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortOrder })}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
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
            <EmptyState
              title="Nothing in this edit. Yet."
              description="Try a different color, size, or price range."
            />
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
