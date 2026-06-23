"use client";

import dynamic from "next/dynamic";
import { useCartDrawer } from "@/app/ui/nova/cart-drawer-context";

const NovaCartDrawer = dynamic(
  () => import("@/app/ui/nova/nova-cart-drawer").then((m) => m.NovaCartDrawer),
  { ssr: false },
);

export function NovaCartDrawerLazy() {
  const { hasOpened } = useCartDrawer();

  if (!hasOpened) return null;
  return <NovaCartDrawer />;
}
