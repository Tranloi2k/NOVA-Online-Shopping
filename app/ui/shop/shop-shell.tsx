import { Suspense } from "react";
import NovaHeader from "@/app/ui/nova/nova-header";
import NovaFooter from "@/app/ui/nova/nova-footer";
import { NovaCartDrawerLazy } from "@/app/ui/nova/nova-cart-drawer-lazy";
import { CartDrawerProvider } from "@/app/ui/nova/cart-drawer-context";
import { WishlistProvider } from "@/app/ui/wishlist/wishlist-context";

function HeaderFallback() {
  return (
    <header className="site-head">
      <div className="wrap head-inner" />
    </header>
  );
}

export default function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <CartDrawerProvider>
      <WishlistProvider>
        <div className="shop-shell">
          <Suspense fallback={<HeaderFallback />}>
            <NovaHeader />
          </Suspense>
          <main id="main-content" className="shop-main">{children}</main>
          <NovaFooter />
          <NovaCartDrawerLazy />
        </div>
      </WishlistProvider>
    </CartDrawerProvider>
  );
}
