"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";
import { useWishlist } from "@/app/ui/wishlist/wishlist-context";

type WishlistHeartButtonProps = {
  productId: number;
  className?: string;
  size?: number;
};

export default function WishlistHeartButton({
  productId,
  className,
  size = 18,
}: WishlistHeartButtonProps) {
  const { isWishlisted, toggle, isLoading } = useWishlist();
  const [isToggling, setIsToggling] = useState(false);
  const active = isWishlisted(productId);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);
    try {
      await toggle(productId);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      type="button"
      className={clsx("fav-btn", className)}
      onClick={handleClick}
      disabled={isLoading || isToggling}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      style={{ color: active ? "var(--sale)" : "var(--ink)" }}
    >
      {active ? (
        <HeartIconSolid style={{ width: size, height: size }} />
      ) : (
        <HeartIcon style={{ width: size, height: size, strokeWidth: 1.5 }} />
      )}
    </button>
  );
}
