import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { money } from "@/services/catalog-query";

export function Price({
  amount,
  original,
}: {
  amount: number;
  original?: number;
}) {
  return (
    <span className="price">
      <span className={original && original > amount ? "sale-price" : ""}>
        {money(amount)}
      </span>
      {original && original > amount ? <del>{money(original)}</del> : null}
    </span>
  );
}

export function ProductCardSkeleton() {
  return (
    <article className="product-card product-card-skeleton" aria-hidden="true">
      <div className="product-image-wrap skeleton-block" />
      <div className="product-info">
        <div className="skeleton-line skeleton-category" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-meta" />
        <div className="skeleton-purchase-row">
          <div className="skeleton-line skeleton-price" />
          <div className="skeleton-button" />
        </div>
      </div>
    </article>
  );
}

export function EmptyState({
  title,
  description,
  href = "/new-arrivals",
  label = "Explore the collection",
  secondaryAction,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
  secondaryAction?: { label: string; onClick: () => void };
}) {
  return (
    <div className="empty-state">
      <span className="empty-symbol">↗</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href={href} className="button">
        {label}
        <ArrowUpRight size={18} />
      </Link>
      {secondaryAction && (
        <button
          type="button"
          className="button button-light empty-state-secondary-action"
          onClick={secondaryAction.onClick}
        >
          {secondaryAction.label}
          <X size={17} />
        </button>
      )}
    </div>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, index) => (
        <span key={index}>
          <span aria-hidden="true">/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
