import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
export function EmptyState({
  title,
  description,
  href = "/new-arrivals",
  label = "Explore the collection",
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
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
