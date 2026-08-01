import { NextRequest, NextResponse } from "next/server";
import { getCheckoutAuth } from "@/app/lib/checkout-auth";
import { createProductCheckoutSession } from "@/app/lib/checkout-sessions";
import { getProductById } from "@/app/lib/services/products";
import { getDefaultAddressId } from "@/app/lib/services/address";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const checkoutAuth = await getCheckoutAuth();
  // Guests may check out via "Buy now"; Stripe Checkout collects their email
  // and shipping address, and the webhook creates a guest order.
  const isGuest = !checkoutAuth.authorized || !checkoutAuth.userId;

  try {
    const { productId, quantity, customerEmail, addressId } =
      await request.json();

    // Validate required fields
    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch product details from DB/API to prevent price tampering
    let dbProduct;
    try {
      dbProduct = await getProductById(String(productId));
    } catch {
      return NextResponse.json(
        { error: `Product with ID ${productId} not found` },
        { status: 404 }
      );
    }

    // Apply discount to the product price if applicable
    const productPrice = Number(dbProduct.price);
    const productDiscount = Number(dbProduct.discount || 0);
    const finalPrice = productPrice - (productPrice * productDiscount) / 100;

    // Create product object with server-verified details
    const product = {
      id: String(dbProduct.id),
      name: dbProduct.name,
      price: finalPrice,
      description: `Purchase of ${dbProduct.name}`,
      image: dbProduct.image,
    };

    // Account checkouts snapshot a saved address; guests supply the address in
    // Stripe Checkout, so no address id is attached for them.
    let metadata: Record<string, string>;
    if (isGuest) {
      metadata = { guest: "1" };
    } else {
      const resolvedAddressId: number | null =
        addressId != null ? Number(addressId) : await getDefaultAddressId();
      metadata = {
        user_id: checkoutAuth.userId as string,
        ...(resolvedAddressId != null
          ? { shipping_address_id: String(resolvedAddressId) }
          : {}),
      };
    }

    const stripeSession = await createProductCheckoutSession(
      product,
      parseInt(quantity, 10),
      // Accounts prefill their email; guests type it into Stripe Checkout.
      isGuest ? customerEmail || undefined : customerEmail ?? checkoutAuth.customerEmail,
      metadata,
    );

    if (!stripeSession.url) {
      return NextResponse.json(
        { error: "Checkout session has no redirect URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}