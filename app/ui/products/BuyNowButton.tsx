"use client";

import { isOutOfStock } from "@/app/lib/product-stock";
import { useRequireAuth } from "@/app/ui/auth/use-require-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface BuyNowButtonProps {
  product: {
    id: string | number;
    name: string;
    price: number;
  };
  quantity?: number;
  stock?: number;
}

export default function BuyNowButton({
  product,
  quantity = 1,
  stock,
}: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { requireAuth, isAuthLoading } = useRequireAuth();
  const { data: session } = useSession();
  const outOfStock = isOutOfStock(stock);

  const handleBuyNow = async () => {
    if (outOfStock) return;
    if (!requireAuth()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: String(product.id),
          productName: product.name,
          price: product.price,
          quantity,
          customerEmail: session?.user?.email ?? undefined,
        }),
      });

      if (response.status === 401) {
        requireAuth();
        return;
      }

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Error initiating checkout:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to start checkout. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const total = product.price * quantity;

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      disabled={outOfStock || isLoading || isAuthLoading}
      className={clsx(
        "btn btn-dark btn-lg btn-block",
        (outOfStock || isLoading || isAuthLoading) && "opacity-60 cursor-not-allowed",
      )}
    >
      {outOfStock ? (
        "Out of stock"
      ) : isLoading ? (
        <>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,.3)",
              borderTopColor: "#fff",
              animation: "spin 0.7s linear infinite",
            }}
          />
          Processing…
        </>
      ) : (
        <>
          Buy now — ${total.toFixed(2)}
          <ArrowRightIcon style={{ width: 16, height: 16 }} strokeWidth={2} />
        </>
      )}
    </button>
  );
}
