import { Suspense } from "react";
import NovaHeader from "@/app/ui/nova/nova-header";
import NovaFooter from "@/app/ui/nova/nova-footer";
import { NovaCartDrawer } from "@/app/ui/nova/nova-cart-drawer";
import { CartDrawerProvider } from "@/app/ui/nova/cart-drawer-context";

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
      <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", background: "var(--bg)" }}>
        <Suspense fallback={<HeaderFallback />}>
          <NovaHeader />
        </Suspense>
        <main style={{ flex: 1 }}>{children}</main>
        <NovaFooter />
        <NovaCartDrawer />
      </div>
    </CartDrawerProvider>
  );
}
