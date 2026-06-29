"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import {
  addToWishlist,
  getWishlistProductIds,
  removeFromWishlist,
} from "@/app/lib/services/wishlist";
import { syncWishlistCount } from "@/app/lib/wishlist-events";
import { useRequireAuth } from "@/app/ui/auth/use-require-auth";

type WishlistCache = {
  userId: string;
  ids: number[];
};

type WishlistContextValue = {
  productIds: Set<number>;
  isLoading: boolean;
  isWishlisted: (productId: number) => boolean;
  toggle: (productId: number) => Promise<boolean>;
  syncProductIds: (ids: number[]) => void;
};

const WishlistContext = createContext<WishlistContextValue>({
  productIds: new Set(),
  isLoading: false,
  isWishlisted: () => false,
  toggle: async () => false,
  syncProductIds: () => {},
});

const EMPTY_IDS = new Set<number>();

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession();
  const { requireAuth } = useRequireAuth();
  const userId =
    status === "authenticated" ? (session?.user?.id ?? null) : null;
  const [cache, setCache] = useState<WishlistCache | null>(null);

  const productIds = useMemo(() => {
    if (!userId || !cache || cache.userId !== userId) {
      return EMPTY_IDS;
    }
    return new Set(cache.ids);
  }, [userId, cache]);

  const isLoading = Boolean(userId && (!cache || cache.userId !== userId));

  useEffect(() => {
    if (!userId) {
      syncWishlistCount(0);
      return;
    }

    let cancelled = false;

    getWishlistProductIds()
      .then((ids) => {
        if (cancelled) return;
        setCache({ userId, ids });
        syncWishlistCount(ids.length);
      })
      .catch(() => {
        if (cancelled) return;
        setCache({ userId, ids: [] });
        syncWishlistCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isWishlisted = useCallback(
    (productId: number) => productIds.has(productId),
    [productIds],
  );

  const toggle = useCallback(
    async (productId: number): Promise<boolean> => {
      if (!requireAuth()) {
        return productIds.has(productId);
      }

      const wasWishlisted = productIds.has(productId);

      try {
        const summary = wasWishlisted
          ? await removeFromWishlist(productId)
          : await addToWishlist(productId);

        const ids = summary.items.map((item) => item.productId);
        if (userId) {
          setCache({ userId, ids });
        }
        syncWishlistCount(summary.totalItems);
        return ids.includes(productId);
      } catch {
        return wasWishlisted;
      }
    },
    [productIds, requireAuth, userId],
  );

  const syncProductIds = useCallback(
    (ids: number[]) => {
      if (!userId) return;
      setCache({ userId, ids });
      syncWishlistCount(ids.length);
    },
    [userId],
  );

  const value = useMemo(
    () => ({
      productIds,
      isLoading,
      isWishlisted,
      toggle,
      syncProductIds,
    }),
    [productIds, isLoading, isWishlisted, toggle, syncProductIds],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
