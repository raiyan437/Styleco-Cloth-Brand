"use client";

import Link from "next/link";
import { ArrowRight, Boxes, Package, PencilLine } from "lucide-react";
import { AdminPageHeader, PreviewLink } from "@/components/admin/admin-ui";
import { useAdmin } from "@/components/admin/admin-provider";

const quickActions = [
  { href: "/admin/categories", label: "Edit a category", icon: Boxes },
  { href: "/admin/products", label: "Add product details", icon: Package },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

export default function AdminDashboardPage() {
  const { snapshot } = useAdmin();
  const publishedCount = Object.values(snapshot.statuses).filter(
    (status) => status === "published",
  ).length;
  const pendingOrders = snapshot.orders.filter(
    (order) => order.status === "pending" || order.status === "processing",
  ).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview / Tuesday, 20 September 2026"
        title="Good morning, Admin."
        description="A quick read on the parts of Styleco that need your attention today."
        action={<PreviewLink />}
      />
      <div className="admin-demo-notice">
        <span className="admin-notice-mark">i</span>
        <div>
          <strong>Local workspace</strong>
          <p>
            Changes are saved in this browser while the Appwrite content layer
            is being prepared.
          </p>
        </div>
        <span className="admin-notice-state">Connected to mock data</span>
      </div>
      <section className="admin-stat-grid" aria-label="Workspace summary">
        <article className="admin-stat-card">
          <span className="admin-stat-label">Catalog products</span>
          <strong>{snapshot.products.length}</strong>
          <span className="admin-stat-detail">
            across {snapshot.categories.length} categories
          </span>
        </article>
        <article className="admin-stat-card admin-stat-card-sage">
          <span className="admin-stat-label">Published content</span>
          <strong>{publishedCount}</strong>
          <span className="admin-stat-detail">
            sections, products and categories
          </span>
        </article>
        <article className="admin-stat-card admin-stat-card-warm">
          <span className="admin-stat-label">Orders to review</span>
          <strong>{pendingOrders}</strong>
          <span className="admin-stat-detail">awaiting the next step</span>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-label">Demo order value</span>
          <strong>
            {formatMoney(
              snapshot.orders.reduce((sum, order) => sum + order.total, 0),
            )}
          </strong>
          <span className="admin-stat-detail">
            from {snapshot.orders.length} sample orders
          </span>
        </article>
      </section>
      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Shortcuts</p>
              <h2>Keep the shop moving</h2>
            </div>
            <PencilLine size={19} aria-hidden="true" />
          </div>
          <div className="admin-quick-grid">
            {quickActions.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="admin-quick-action">
                <span>
                  <Icon size={19} />
                </span>
                <strong>{label}</strong>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </section>
        <section className="admin-panel admin-panel-activity">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Latest changes</p>
              <h2>Activity</h2>
            </div>
            <Link href="/admin/activity-log" className="admin-text-link">
              View all
            </Link>
          </div>
          <div className="admin-activity-list">
            {snapshot.activity.slice(0, 5).map((item) => (
              <div className="admin-activity-row" key={item.id}>
                <span className="admin-activity-dot" />
                <div>
                  <strong>{item.action}</strong>
                  <p>{item.detail}</p>
                </div>
                <time dateTime={item.createdAt}>
                  {new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </time>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="admin-panel admin-panel-table">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Order queue</p>
            <h2>Recent orders</h2>
          </div>
          <Link href="/admin/orders" className="admin-text-link">
            Manage orders <ArrowRight size={14} />
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {snapshot.orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                    <small>{order.itemCount} items</small>
                  </td>
                  <td>{order.customer}</td>
                  <td>
                    <span
                      className={`admin-order-status admin-order-status-${order.status}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{formatMoney(order.total)}</td>
                  <td>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="admin-row-link"
                    >
                      Open <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
