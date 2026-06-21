import { NextRequest, NextResponse } from "next/server";
import { getCheckoutAuth } from "@/app/lib/checkout-auth";
import { createProductCheckoutSession } from "@/app/lib/checkout-sessions";
import { getProductById } from "@/app/lib/services/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const checkoutAuth = await getCheckoutAuth();
  if (!checkoutAuth.authorized || !checkoutAuth.userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const { productId, quantity, customerEmail } =
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

    const stripeSession = await createProductCheckoutSession(
      product,
      parseInt(quantity, 10),
      customerEmail ?? checkoutAuth.customerEmail,
      {
        user_id: checkoutAuth.userId ?? "",
      },
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