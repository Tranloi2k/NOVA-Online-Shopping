import { getWishlistSummary } from "@/app/lib/services/wishlist";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";
import WishlistList from "./wishlist-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "My Wishlist",
  description: "View and manage your saved NOVA products.",
  pathname: "/account/wishlist",
  noIndex: true,
});

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { items } = await getWishlistSummary();

  return (
    <div className="acct-card">
      <div className="acct-card-head">
        <h3>Wishlist</h3>
        <span className="muted" style={{ fontSize: 14 }}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
      <WishlistList initialItems={items} />
    </div>
  );
}
