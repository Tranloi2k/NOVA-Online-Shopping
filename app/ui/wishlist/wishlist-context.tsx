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

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { requireAuth } = useRequireAuth();
  const [productIds, setProductIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setProductIds(new Set());
      syncWishlistCount(0);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    getWishlistProductIds()
      .then((ids) => {
        if (cancelled) return;
        const next = new Set(ids);
        setProductIds(next);
        syncWishlistCount(next.size);
      })
      .catch(() => {
        if (!cancelled) {
          setProductIds(new Set());
          syncWishlistCount(0);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

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

        const next = new Set(summary.items.map((item) => item.productId));
        setProductIds(next);
        syncWishlistCount(summary.totalItems);
        return next.has(productId);
      } catch {
        return wasWishlisted;
      }
    },
    [productIds, requireAuth],
  );

  const syncProductIds = useCallback((ids: number[]) => {
    const next = new Set(ids);
    setProductIds(next);
    syncWishlistCount(next.size);
  }, []);

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
