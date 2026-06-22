"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Icon } from "@/app/ui/nova/nova-icons";
import { useCartDrawer } from "@/app/ui/nova/cart-drawer-context";
import { CART_UPDATED_EVENT, syncCartBadge } from "@/app/lib/cart-events";
import { categoryNavHref, CATEGORY_NAV_ITEMS } from "@/app/lib/product-filters";
import { getCartSummary } from "@/app/lib/services/cart";

function readStoredCartCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("cartItemsCount");
  if (!stored) return 0;
  const parsed = Number.parseInt(stored, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function subscribeCartCount(onStoreChange: () => void) {
  const onUpdate = () => onStoreChange();
  window.addEventListener(CART_UPDATED_EVENT, onUpdate);
  return () => window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
}

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function NovaHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toggle: toggleCart } = useCartDrawer();

  const cartCount = useSyncExternalStore(
    subscribeCartCount,
    readStoredCartCount,
    () => 0,
  );

  const isClient = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (status === "authenticated") {
      getCartSummary()
        .then((summary) => {
          if (!cancelled) {
            syncCartBadge(summary.cart?.quantity ?? 0);
          }
        })
        .catch((err) => {
          console.error("Failed to sync cart on login:", err);
          if (!cancelled) {
            syncCartBadge(0);
          }
        });
    } else if (status === "unauthenticated") {
      syncCartBadge(0);
    }
    return () => {
      cancelled = true;
    };
  }, [status]);

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : null;

  return (
    <header className={`site-head${scrolled ? " scrolled" : ""}`}>
      <div className="wrap head-inner">
        <Link className="logo-btn" href="/" aria-label="NOVA home">
          {!logoError ? (
            <Image
              src="/nova-logo.png"
              alt="NOVA"
              width={88}
              height={22}
              priority
              className="logo-img"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: "-0.03em",
              }}
            >
              NOVA
            </span>
          )}
        </Link>

        <nav className="head-nav">
          <Link
            href="/"
            className={`nav-link${pathname === "/" ? " is-active" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`nav-link${pathname.startsWith("/products") ? " is-active" : ""}`}
          >
            Shop
          </Link>
          {CATEGORY_NAV_ITEMS.map((c) => (
            <Link
              key={c.id}
              href={categoryNavHref(c.id)}
              className="nav-link"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="head-actions">
          <Link
            href="/products"
            className="icon-btn show-md"
            aria-label="Search"
          >
            <Icon name="search" size={20} />
          </Link>

          {user ? (
            <Link
              href="/account"
              className={`avatar-btn${pathname === "/account" ? " is-active" : ""}`}
              aria-label="Account"
            >
              {initials ?? "N"}
            </Link>
          ) : (
            <Link href="/login" className="icon-btn" aria-label="Sign in">
              <Icon name="user" size={20} />
            </Link>
          )}

          <button
            className="icon-btn cart-btn"
            aria-label={`Bag, ${cartCount} items`}
            onClick={toggleCart}
          >
            <Icon name="cart" size={20} />
            {cartCount > 0 && (
              <span className="cart-badge mono-num">{cartCount}</span>
            )}
          </button>

          <button
            className="icon-btn hide-md head-menu-btn"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

      {isClient &&
        menuOpen &&
        createPortal(
          <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
            <div
              className="mobile-menu-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: "-0.03em",
                  }}
                >
                  NOVA
                </span>
                <button
                  className="icon-btn"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>
              {(
                [
                  ["/", "Home"],
                  ["/products", "Shop"],
                ] as const
              ).map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="m-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {CATEGORY_NAV_ITEMS.map((c) => (
                <Link
                  key={c.id}
                  href={categoryNavHref(c.id)}
                  className="m-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {c.label}
                </Link>
              ))}
              <Link
                href={user ? "/account" : "/login"}
                className="m-link"
                onClick={() => setMenuOpen(false)}
              >
                {user ? "My account" : "Sign in"}
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
