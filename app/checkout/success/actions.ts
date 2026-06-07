"use server";

import { retrieveCheckoutSession } from "@/app/lib/checkout-sessions";
import { confirmOrder } from "@/app/lib/services/user";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { revalidateAfterCartChange } from "@/app/lib/revalidate-shop";

export async function confirmCheckoutOrderAction(sessionId: string) {
  try {
    const session = await retrieveCheckoutSession(sessionId);
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return { success: false, error: "Not logged in" };
    }

    const orderType = session.metadata?.order_type === "cart" ? "cart" : "direct";
    const productId = session.metadata?.product_id ? Number(session.metadata.product_id) : undefined;
    const quantity = session.metadata?.quantity ? Number(session.metadata.quantity) : undefined;
    const total = session.amount_total ? session.amount_total / 100 : 0;

    await confirmOrder(userId, {
      stripeSessionId: session.id,
      total,
      orderType,
      productId,
      quantity,
    });

    // Revalidate caches (fully supported inside Server Actions)
    revalidateAfterCartChange({ userId });
    revalidateTag("orders");
    revalidateTag(`user-orders-${userId}`);

    return { success: true };
  } catch (error) {
    console.error("Error confirming checkout order:", error);
    const message = error instanceof Error ? error.message : "Failed to confirm order";
    return { success: false, error: message };
  }
}
