"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/app/ui/nova/nova-icons";
import { formatMoney } from "@/app/ui/nova/nova-utils";
import { useCartDrawer } from "@/app/ui/nova/cart-drawer-context";
import { getCartSummary } from "@/app/lib/services/cart";
import type { CartItem, CartSummary } from "@/app/lib/definitions";
import { useRequireAuth } from "@/app/ui/auth/use-require-auth";
import { getSafeImageUrl } from "@/app/lib/utils";

export function NovaCartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { requireAuth } = useRequireAuth();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!requireAuth()) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/cart", {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 401) {
        setIsCheckingOut(false);
        requireAuth();
        return;
      }

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }

      close();
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not start checkout. Please try again.",
      );
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getCartSummary()
      .then((data) => setSummary(data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const items: CartItem[] = summary?.cart?.items ?? [];
  const subtotal = summary?.finalPrice ?? 0;

  return (
    <div className={`drawer-scrim${isOpen ? " open" : ""}`} onClick={close}>
      <aside
        className={`drawer${isOpen ? " open" : ""}`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping bag"
      >
        <div className="drawer-head">
          <h3 style={{ fontSize: 20 }}>Your bag</h3>
          <button className="icon-btn" onClick={close} aria-label="Close">
            <Icon name="close" size={22} />
          </button>
        </div>

        {loading ? (
          <div className="drawer-empty">
            <div className="empty-glyph">
              <Icon name="cart" size={30} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 17 }}>Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="drawer-empty">
            <div className="empty-glyph">
              <Icon name="cart" size={30} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 17 }}>Your bag is empty</p>
            <p className="muted" style={{ fontSize: 14 }}>
              Find something you&apos;ll love.
            </p>
            <button
              className="btn btn-dark"
              onClick={close}
              style={{ marginTop: 8 }}
            >
              <Link href="/products" onClick={close}>
                Start shopping
              </Link>
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-list">
              {items.map((it) => {
                const imgSrc = getSafeImageUrl(it.product.image);
                return (
                <div className="drawer-item" key={it.id}>
                  <div className="drawer-thumb">
                    <div
                      className="tile"
                      style={{ aspectRatio: "1 / 1", position: "relative" }}
                    >
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={it.product.name}
                          fill
                          className="object-contain p-2"
                          sizes="74px"
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "var(--surface-muted)" }} />
                      )}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14.5,
                          lineHeight: 1.25,
                        }}
                      >
                        {it.product.name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <span className="muted" style={{ fontSize: 13 }}>
                        Qty: {it.quantity}
                      </span>
                      <span className="price" style={{ fontSize: 15 }}>
                        {formatMoney(it.price * it.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
            <div className="drawer-foot">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span className="muted">Subtotal</span>
                <span className="price" style={{ fontSize: 20 }}>
                  {formatMoney(subtotal)}
                </span>
              </div>
              <p
                className="muted"
                style={{ fontSize: 12.5, marginBottom: 14 }}
              >
                Shipping &amp; taxes calculated at checkout.
              </p>
              {error && (
                <p className="error-text" style={{ color: "var(--sale)", fontSize: 13, marginTop: 8, marginBottom: 8, textAlign: "center" }}>
                  {error}
                </p>
              )}
              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="btn btn-primary btn-block btn-lg"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                {isCheckingOut ? (
                  <>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,.3)",
                        borderTopColor: "#fff",
                        animation: "spin 0.7s linear infinite",
                        marginRight: 8,
                        display: "inline-block"
                      }}
                    />
                    Processing…
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
              <Link
                href="/cart"
                onClick={close}
                className="btn btn-ghost btn-block"
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                View full bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
