"use server";

import { authFetch } from "@/app/lib/api-client";
import { CACHE_TAGS } from "@/app/lib/cache-tags";
import type { WishlistSummary } from "@/app/lib/definitions";
import { revalidateAfterWishlistChange } from "@/app/lib/revalidate-shop";
import { unauthorized } from "next/navigation";
import { resolveUserId } from "@/app/lib/auth-tokens";

const EMPTY_WISHLIST: WishlistSummary = {
  items: [],
  totalItems: 0,
};

async function getApiUrl(): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
  }
  return apiUrl;
}

async function readApiError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) {
      return body.message.join(", ");
    }
    if (typeof body.message === "string" && body.message.length > 0) {
      return body.message;
    }
  } catch {
    // ignore parse errors
  }
  return fallback;
}

async function revalidateWishlistCaches(options?: {
  productId?: string | number;
}) {
  const userId = await resolveUserId();

  revalidateAfterWishlistChange({
    userId,
    productId: options?.productId,
    refreshRoute: true,
  });
}

async function fetchWishlistResponse(): Promise<Response> {
  const apiUrl = await getApiUrl();
  const userId = await resolveUserId() ?? "";

  const tags: string[] = [CACHE_TAGS.wishlist];
  if (userId) {
    tags.push(CACHE_TAGS.wishlistUser(userId));
  }

  return authFetch(`${apiUrl}/wishlist`, {
    method: "GET",
    cache: "no-store",
    next: { tags },
  });
}

export async function getWishlistSummary(): Promise<WishlistSummary> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return EMPTY_WISHLIST;
  }

  const res = await fetchWishlistResponse();

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    console.error("Failed to fetch wishlist:", res.status);
    return EMPTY_WISHLIST;
  }

  return res.json();
}

export async function getWishlistProductIds(): Promise<number[]> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return [];
  }

  const userId = await resolveUserId() ?? "";
  const tags: string[] = [CACHE_TAGS.wishlist];
  if (userId) {
    tags.push(CACHE_TAGS.wishlistUser(userId));
  }

  const res = await authFetch(`${apiUrl}/wishlist/ids`, {
    method: "GET",
    cache: "no-store",
    next: { tags },
  });

  if (res.status === 401) {
    return [];
  }

  if (!res.ok) {
    console.error("Failed to fetch wishlist ids:", res.status);
    return [];
  }

  const data = (await res.json()) as { productIds?: number[] };
  return data.productIds ?? [];
}

export async function checkInWishlist(
  productId: string | number,
): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return false;
  }

  const res = await authFetch(`${apiUrl}/wishlist/check/${productId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (res.status === 401 || !res.ok) {
    return false;
  }

  const data = (await res.json()) as { inWishlist?: boolean };
  return Boolean(data.inWishlist);
}

export async function addToWishlist(
  productId: string | number,
): Promise<WishlistSummary> {
  const apiUrl = await getApiUrl();

  const res = await authFetch(`${apiUrl}/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: Number(productId) }),
  });

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    throw new Error(await readApiError(res, "Failed to add to wishlist"));
  }

  const data: WishlistSummary = await res.json();
  await revalidateWishlistCaches({ productId });
  return data;
}

export async function removeFromWishlist(
  productId: string | number,
): Promise<WishlistSummary> {
  const apiUrl = await getApiUrl();

  const res = await authFetch(`${apiUrl}/wishlist/items/${productId}`, {
    method: "DELETE",
  });

  if (res.status === 401) {
    unauthorized();
  }

  if (!res.ok) {
    throw new Error(await readApiError(res, "Failed to remove from wishlist"));
  }

  const data: WishlistSummary = await res.json();
  await revalidateWishlistCaches({ productId });
  return data;
}

export async function toggleWishlist(
  productId: string | number,
  currentlyInWishlist: boolean,
): Promise<WishlistSummary> {
  if (currentlyInWishlist) {
    return removeFromWishlist(productId);
  }
  return addToWishlist(productId);
}
