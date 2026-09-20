"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import { useAdmin } from "@/components/admin/admin-provider";
import {
  AdminButton,
  AdminPageHeader,
  StatusBadge,
} from "@/components/admin/admin-ui";

export default function AdminCategoriesPage() {
  const { snapshot, updateSnapshot } = useAdmin();
  const router = useRouter();

  function addCategory() {
    const template = snapshot.categories[0];
    if (!template) return;

    const id = `category-${Date.now()}`;
    const slug = `new-category-${Date.now()}`;
    const image = template.image
      ? {
          ...template.image,
          id,
          alt: "New category editorial collection",
        }
      : undefined;

    updateSnapshot(
      (current) => ({
        ...current,
        categories: [
          ...current.categories,
          {
            ...template,
            id,
            slug,
            name: "New category",
            editorialLabel: "New collection",
            position: current.categories.length,
            image,
          },
        ],
        media: image
          ? [
              ...current.media,
              {
                id: `category-${id}`,
                url: image.url,
                alt: image.alt,
                slot: "category",
                status: "draft",
                source: "fixture",
              },
            ]
          : current.media,
        statuses: { ...current.statuses, [`category:${id}`]: "draft" },
      }),
      {
        action: "Category created",
        entity: "New category",
        detail: "Draft category added to the local workspace",
      },
    );
    router.push(`/admin/categories/${id}`);
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog / Categories"
        title="Give every collection its own frame."
        description="Browse your collections, then open one to edit its naming, status and storefront crop."
        action={
          <AdminButton variant="secondary" onClick={addCategory}>
            <Plus size={15} /> New category
          </AdminButton>
        }
      />
      <section className="admin-panel admin-list-panel admin-category-catalog-list-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Collections</p>
            <h2>{snapshot.categories.length} categories</h2>
          </div>
          <span className="admin-surface-note">Open a category to edit</span>
        </div>
        {snapshot.categories.length ? (
          <div className="admin-category-list">
            {snapshot.categories.map((category) => {
              const status =
                snapshot.statuses[`category:${category.id}`] ?? "published";
              return (
                <Link
                  href={`/admin/categories/${category.id}`}
                  key={category.id}
                  className="admin-category-list-item"
                >
                  <span className="admin-list-thumb">
                    {category.image && (
                      <Image
                        src={category.image.url}
                        alt=""
                        fill
                        unoptimized
                        sizes="56px"
                      />
                    )}
                  </span>
                  <span className="admin-list-item-copy">
                    <strong>{category.name}</strong>
                    <small>/{category.slug}</small>
                  </span>
                  <StatusBadge status={status} />
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty-state">
            <h2>No categories yet</h2>
            <p>Create a category to start building your collections.</p>
          </div>
        )}
      </section>
    </>
  );
}
