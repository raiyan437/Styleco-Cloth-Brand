"use client";

import Link from "next/link";
import { ClipboardList, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/admin-provider";
import {
  AdminButton,
  AdminPageHeader,
  AdminPagination,
  AdminSelect,
} from "@/components/admin/admin-ui";
import type { AdminOrder } from "@/domain/admin";

const ORDERS_PER_PAGE = 15;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminOrdersPage() {
  const { snapshot } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AdminOrder["status"]>("all");
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return snapshot.orders
      .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((order) => {
        const matchesQuery = `${order.id} ${order.customer}`
          .toLowerCase()
          .includes(normalizedQuery);
        return matchesQuery && (status === "all" || order.status === status);
      });
  }, [query, snapshot.orders, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  function exportQueue() {
    const rows = [
      ["Order", "Customer", "Status", "Items", "Total", "Created"],
      ...filteredOrders.map((order) => [
        order.id,
        order.customer,
        order.status,
        String(order.itemCount),
        String(order.total / 100),
        order.createdAt,
      ]),
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "styleco-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Commerce / Orders"
        title="See what needs a hand."
        description="Browse the order queue newest first, then open an order to review its details and update fulfilment status."
        action={
          <AdminButton variant="secondary" onClick={exportQueue}>
            <ClipboardList size={15} /> Export queue
          </AdminButton>
        }
      />
      <div className="admin-demo-notice">
        <span className="admin-notice-mark">i</span>
        <div>
          <strong>Orders are currently sample data</strong>
          <p>
            No checkout order is written to this workspace until the production
            commerce repository is connected.
          </p>
        </div>
        <span className="admin-notice-state">Read/write preview</span>
      </div>
      <section className="admin-panel admin-list-panel admin-orders-list-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Queue</p>
            <h2>{filteredOrders.length} recent orders</h2>
          </div>
          <span className="admin-surface-note">
            Newest first · {ORDERS_PER_PAGE} per page
          </span>
        </div>
        <div className="admin-filter-row">
          <label className="admin-search-field">
            <Search size={16} />
            <span className="sr-only">Search orders</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search order or customer"
            />
          </label>
          <AdminSelect
            value={status}
            onChange={(value) => {
              setStatus(value as "all" | AdminOrder["status"]);
              setPage(1);
            }}
            ariaLabel="Filter orders by status"
            options={[
              { value: "all", label: "All statuses" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
            ]}
          />
        </div>
        {visibleOrders.length ? (
          <div className="admin-order-list">
            {visibleOrders.map((order) => (
              <Link
                href={`/admin/orders/${order.id}`}
                key={order.id}
                className="admin-order-row"
              >
                <span className="admin-order-id">
                  <strong>{order.id}</strong>
                  <small>{formatDate(order.createdAt)}</small>
                </span>
                <span>
                  <strong>{order.customer}</strong>
                  <small>
                    {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                  </small>
                </span>
                <span
                  className={`admin-order-status admin-order-status-${order.status}`}
                >
                  {order.status}
                </span>
                <strong>{formatMoney(order.total)}</strong>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <Search size={22} />
            <h2>No orders found</h2>
            <p>Try a different order number, customer or status.</p>
          </div>
        )}
        <AdminPagination
          page={currentPage}
          pageSize={ORDERS_PER_PAGE}
          totalItems={filteredOrders.length}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>
    </>
  );
}
