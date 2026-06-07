import { getUserOrders } from "@/app/lib/services/user";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { buildPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "My Orders",
  description: "View your NOVA purchase history.",
  pathname: "/account/orders",
  noIndex: true,
});

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: "delivered" | "shipped" | "processing";
  total: number;
  items: OrderItem[];
}

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders: Order[] = await getUserOrders();

  return (
    <div className="acct-card">
      <div className="acct-card-head">
        <h3>Order History</h3>
      </div>

      {orders.length === 0 ? (
        <div className="cart-empty" style={{ paddingBlock: 64 }}>
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
          <p style={{ fontWeight: 700, fontSize: 17, marginTop: 16 }}>No orders found</p>
          <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
            You have not placed any orders yet.
          </p>
          <Link href="/products" className="btn btn-dark" style={{ marginTop: 20 }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order: Order) => (
            <div className="order-card" key={order.id}>
              <div className="order-head">
                <div className="order-meta">
                  <div>
                    <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Order Placed</div>
                    <div style={{ fontWeight: 700, marginTop: 3 }}>{order.date}</div>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total</div>
                    <div className="price" style={{ fontSize: 14.5, marginTop: 3 }}>${order.total.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Order ID</div>
                    <div style={{ fontWeight: 700, marginTop: 3, fontFamily: "monospace", letterSpacing: "-0.02em" }}>{order.id}</div>
                  </div>
                </div>
                <div className="order-status">
                  <span
                    className="dot"
                    style={{
                      backgroundColor:
                        order.status === "delivered"
                          ? "var(--good)"
                          : order.status === "shipped"
                          ? "var(--accent)"
                          : "#f5a524",
                    }}
                  />
                  <span style={{ textTransform: "capitalize", fontWeight: 700 }}>{order.status}</span>
                </div>
              </div>

              <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
                {order.items.map((item: OrderItem) => (
                  <div key={item.id} style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <div
                      style={{
                        width: 68,
                        height: 68,
                        position: "relative",
                        backgroundColor: "var(--surface)",
                        borderRadius: "var(--r-xs)",
                        overflow: "hidden",
                        flexShrink: 0
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="68px"
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{item.name}</h4>
                      <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                        Qty: {item.quantity} · <span className="price">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div>
                      <Link href="/products" className="btn btn-sm btn-line">
                        Buy Again
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
