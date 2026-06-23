"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/app/ui/shared/safe-image";
import { getSafeImageUrl } from "@/app/lib/utils";

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";
type OrderTab = "all" | OrderStatus;

export interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

const TABS: { id: OrderTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const EMPTY_MESSAGES: Record<OrderTab, { title: string; description: string }> = {
  all: {
    title: "No orders found",
    description: "You have not placed any orders yet.",
  },
  processing: {
    title: "No processing orders",
    description: "Orders being prepared will appear here.",
  },
  shipped: {
    title: "No shipped orders",
    description: "Orders on the way will appear here.",
  },
  delivered: {
    title: "No delivered orders",
    description: "Completed deliveries will appear here.",
  },
  cancelled: {
    title: "No cancelled orders",
    description: "Cancelled orders will appear here.",
  },
};

function statusColor(status: OrderStatus): string {
  switch (status) {
    case "delivered":
      return "var(--good)";
    case "shipped":
      return "var(--accent)";
    case "cancelled":
      return "var(--sale)";
    default:
      return "#f5a524";
  }
}

function OrdersEmpty({
  tab,
  showShopLink = true,
}: {
  tab: OrderTab;
  showShopLink?: boolean;
}) {
  const { title, description } = EMPTY_MESSAGES[tab];

  return (
    <div className="cart-empty" style={{ paddingBlock: 48 }}>
      <div className="empty-glyph big">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ width: 40, height: 40 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
      <p style={{ fontWeight: 700, fontSize: 17, marginTop: 16 }}>{title}</p>
      <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
        {description}
      </p>
      {showShopLink && (
        <Link href="/products" className="btn btn-dark" style={{ marginTop: 20 }}>
          Start Shopping
        </Link>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="order-card">
      <div className="order-head">
        <div className="order-meta">
          <div>
            <div
              className="muted"
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Order Placed
            </div>
            <div style={{ fontWeight: 700, marginTop: 3 }}>{order.date}</div>
          </div>
          <div>
            <div
              className="muted"
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Total
            </div>
            <div className="price" style={{ fontSize: 14.5, marginTop: 3 }}>
              ${order.total.toFixed(2)}
            </div>
          </div>
          <div>
            <div
              className="muted"
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Order ID
            </div>
            <div className="order-id">{order.id}</div>
          </div>
        </div>
        <div className="order-status">
          <span className="dot" style={{ backgroundColor: statusColor(order.status) }} />
          <span style={{ textTransform: "capitalize", fontWeight: 700 }}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="order-body">
        {order.items.map((item) => {
          const imgSrc = getSafeImageUrl(item.image);
          return (
            <div key={item.id} className="order-item">
              <div className="order-item-thumb">
                {imgSrc ? (
                  <SafeImage
                    src={imgSrc}
                    alt={item.name}
                    fill
                    className="object-contain p-1.5"
                    sizes="68px"
                  />
                ) : (
                  <div className="order-item-thumb-fallback" />
                )}
              </div>
              <div className="order-item-info">
                <h4>{item.name}</h4>
                <div className="muted order-item-meta">
                  Qty: {item.quantity} ·{" "}
                  <span className="price">${item.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="order-item-actions">
                <Link href="/products" className="btn btn-sm btn-line">
                  Buy Again
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersList({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<OrderTab>("all");

  const counts = useMemo(() => {
    const result: Record<OrderTab, number> = {
      all: orders.length,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    for (const order of orders) {
      if (order.status in result) {
        result[order.status as OrderStatus] += 1;
      }
    }

    return result;
  }, [orders]);

  const filteredOrders =
    tab === "all" ? orders : orders.filter((order) => order.status === tab);

  if (orders.length === 0) {
    return <OrdersEmpty tab="all" />;
  }

  return (
    <>
      <div className="order-tabs">
        <div className="tab-row order-tab-row">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`tab order-tab${tab === id ? " is-active" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
              <span className="order-tab-count">{counts[id]}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <OrdersEmpty tab={tab} showShopLink={false} />
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
