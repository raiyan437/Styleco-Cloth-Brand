"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { useAdmin } from "@/components/admin/admin-provider";
import { AdminPageHeader, AdminSelect } from "@/components/admin/admin-ui";
import type { AdminOrder } from "@/domain/admin";

const statusSteps: Array<{
  label: string;
  status: AdminOrder["status"];
}> = [
  { label: "Order received", status: "pending" },
  { label: "Preparing items", status: "processing" },
  { label: "Shipped", status: "shipped" },
  { label: "Delivered", status: "delivered" },
];

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

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { snapshot, updateSnapshot } = useAdmin();
  const order = snapshot.orders.find((item) => item.id === params.id);

  function updateStatus(status: AdminOrder["status"]) {
    if (!order) return;
    updateSnapshot(
      (current) => ({
        ...current,
        orders: current.orders.map((item) =>
          item.id === order.id ? { ...item, status } : item,
        ),
      }),
      {
        action: "Order status changed",
        entity: order.id,
        detail: `Order marked ${status}`,
      },
    );
  }

  if (!order) {
    return (
      <div className="admin-empty-state">
        <h1>Order not found</h1>
        <p>This order is no longer in the local queue.</p>
        <Link
          href="/admin/orders"
          className="admin-button admin-button-secondary"
        >
          <ArrowLeft size={15} /> Back to orders
        </Link>
      </div>
    );
  }

  const currentStep = statusSteps.findIndex(
    (step) => step.status === order.status,
  );

  return (
    <>
      <AdminPageHeader
        eyebrow={`Commerce / ${order.id}`}
        title={`Order ${order.id}.`}
        description="Review the customer summary and move this order through its fulfilment timeline."
        action={
          <Link
            href="/admin/orders"
            className="admin-button admin-button-secondary"
          >
            <ArrowLeft size={15} /> Back to orders
          </Link>
        }
      />
      <section className="admin-panel admin-order-detail admin-order-detail-page">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Order detail</p>
            <h2>{order.id}</h2>
          </div>
          <PackageCheck size={22} />
        </div>
        <div className="admin-order-summary">
          <div>
            <span>Customer</span>
            <strong>{order.customer}</strong>
          </div>
          <div>
            <span>Placed</span>
            <strong>{formatDate(order.createdAt)}</strong>
          </div>
          <div>
            <span>Items</span>
            <strong>{order.itemCount}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{formatMoney(order.total)}</strong>
          </div>
        </div>
        <div className="admin-field">
          <span className="admin-field-label">Fulfilment status</span>
          <AdminSelect
            value={order.status}
            ariaLabel="Fulfilment status"
            onChange={(value) => updateStatus(value as AdminOrder["status"])}
            options={[
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
            ]}
          />
        </div>
        <div className="admin-order-timeline">
          {statusSteps.map((step, index) => (
            <span
              className={index <= currentStep ? "is-done" : ""}
              key={step.status}
            >
              {step.label}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
