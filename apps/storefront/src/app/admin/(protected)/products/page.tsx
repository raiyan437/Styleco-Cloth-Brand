"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, PackagePlus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/admin-provider";
import {
  AdminButton,
  AdminPageHeader,
  AdminPagination,
  AdminSelect,
  StatusBadge,
} from "@/components/admin/admin-ui";
import type { Product } from "@/domain/catalog";

const PRODUCTS_PER_PAGE = 15;

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

export default function AdminProductsPage() {
  const { snapshot, updateSnapshot } = useAdmin();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return snapshot.products
      .toSorted((a, b) =>
        (b.releasedAt ?? "").localeCompare(a.releasedAt ?? ""),
      )
      .filter((product) => {
        const matchesQuery = `${product.name} ${product.slug}`
          .toLowerCase()
          .includes(normalizedQuery);
        return (
          matchesQuery &&
          (category === "all" || product.categoryIds.includes(category))
        );
      });
  }, [category, query, snapshot.products]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  function addProduct() {
    const createdAt = new Date();
    const id = `product-${crypto.randomUUID()}`;
    const slug = `new-product-${createdAt.getTime()}`;
    const product: Product = {
      id,
      slug,
      name: "New product",
      categoryIds: snapshot.categories[0]?.id
        ? [snapshot.categories[0].id]
        : [],
      description: "Add a considered product story for this new draft.",
      material: "",
      fit: "",
      care: "",
      images: [],
      cardImage: undefined,
      colorImages: {},
      colorCardImages: {},
      variants: [],
      isNew: true,
      releasedAt: createdAt.toISOString(),
      rating: 0,
      reviewCount: 0,
      keywords: [],
      seoTitle: "",
      seoDescription: "",
      adminManaged: true,
    };

    updateSnapshot(
      (current) => ({
        ...current,
        products: [...current.products, product],
        statuses: { ...current.statuses, [`product:${id}`]: "draft" },
      }),
      {
        action: "Product created",
        entity: "New product",
        detail: "Draft product added to the local workspace",
      },
    );
    router.push(`/admin/products/${id}`);
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog / Products"
        title="Keep the catalog considered."
        description="Browse the catalog newest first, then open a product to edit its story, image crop and variant stock."
        action={
          <AdminButton variant="secondary" onClick={addProduct}>
            <PackagePlus size={15} /> New product
          </AdminButton>
        }
      />
      <section className="admin-panel admin-list-panel admin-catalog-list-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Catalog</p>
            <h2>{filteredProducts.length} products</h2>
          </div>
          <span className="admin-surface-note">
            Newest first · {PRODUCTS_PER_PAGE} per page
          </span>
        </div>
        <div className="admin-filter-row">
          <label className="admin-search-field">
            <Search size={16} />
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search products"
            />
          </label>
          <AdminSelect
            value={category}
            onChange={(event) => {
              setCategory(event);
              setPage(1);
            }}
            ariaLabel="Filter products by category"
            options={[
              { value: "all", label: "All categories" },
              ...snapshot.categories.map((item) => ({
                value: item.id,
                label: item.name,
              })),
            ]}
          />
        </div>
        {visibleProducts.length ? (
          <div className="admin-product-list">
            {visibleProducts.map((product) => {
              const status =
                snapshot.statuses[`product:${product.id}`] ?? "published";
              const image = product.images[0];
              return (
                <Link
                  href={`/admin/products/${product.id}`}
                  key={product.id}
                  className="admin-product-list-item"
                >
                  <span className="admin-list-thumb admin-product-thumb">
                    {image && (
                      <Image
                        src={image.url}
                        alt=""
                        fill
                        unoptimized
                        sizes="56px"
                      />
                    )}
                  </span>
                  <span className="admin-list-item-copy">
                    <strong>{product.name}</strong>
                    <small>
                      {formatMoney(product.variants[0]?.price.amount ?? 0)} ·{" "}
                      {snapshot.categories.find(
                        (item) => item.id === product.categoryIds[0],
                      )?.name ?? product.categoryIds[0]}
                    </small>
                  </span>
                  <StatusBadge status={status} />
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty-state">
            <Search size={22} />
            <h2>No products found</h2>
            <p>Try a different product name or category filter.</p>
          </div>
        )}
        <AdminPagination
          page={currentPage}
          pageSize={PRODUCTS_PER_PAGE}
          totalItems={filteredProducts.length}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
