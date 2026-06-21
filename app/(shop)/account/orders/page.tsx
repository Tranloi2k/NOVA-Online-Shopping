import { getUserOrders } from "@/app/lib/services/user";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";
import OrdersList, { type Order } from "./orders-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "My Orders",
  description: "View your NOVA purchase history.",
  pathname: "/account/orders",
  noIndex: true,
});

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = (await getUserOrders()) as Order[];

  return (
    <div className="acct-card">
      <div className="acct-card-head">
        <h3>Order History</h3>
      </div>
      <OrdersList orders={orders} />
    </div>
  );
}
