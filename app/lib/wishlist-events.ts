export const WISHLIST_UPDATED_EVENT = "wishlist-updated";

export function syncWishlistCount(count: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem("wishlistItemsCount", count.toString());
  window.dispatchEvent(
    new CustomEvent(WISHLIST_UPDATED_EVENT, { detail: { count } }),
  );
}
