"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StorefrontPoster } from "@/app/lib/definitions";
import { productPath } from "@/app/lib/product-path";
import { SafeImage } from "@/app/ui/shared/safe-image";

type PosterTickerStripProps = {
  posters: StorefrontPoster[];
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden>
      <path
        d={direction === "right" ? "M2 2l9 9-9 9" : "M12 2L3 11l9 9"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PosterTickerStrip({ posters }: PosterTickerStripProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setCanScrollPrev(rail.scrollLeft > 8);
    setCanScrollNext(maxScroll > 8 && rail.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [posters.length, updateScrollState]);

  const scrollByStep = useCallback(
    (direction: -1 | 1) => {
      const rail = railRef.current;
      if (!rail) return;
      const firstCard = rail.querySelector<HTMLElement>(".poster-card");
      const gap = 16;
      const step = ((firstCard?.offsetWidth ?? 340) + gap) * direction;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rail.scrollBy({ left: step, behavior: prefersReducedMotion ? "auto" : "smooth" });
      window.setTimeout(updateScrollState, 320);
    },
    [updateScrollState],
  );

  if (posters.length === 0) return null;

  const showNav = posters.length > 1;

  return (
    <section className="poster-rail pt-100" aria-label="Featured promotions">
      <div className="poster-rail-outer">
        {showNav && (
          <>
            <button
              type="button"
              className="poster-rail-nav poster-rail-prev"
              onClick={() => scrollByStep(-1)}
              disabled={!canScrollPrev}
              aria-label="Previous posters"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              className="poster-rail-nav poster-rail-next"
              onClick={() => scrollByStep(1)}
              disabled={!canScrollNext}
              aria-label="Next posters"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}

        <div
          ref={railRef}
          className="poster-rail-track"
          onScroll={updateScrollState}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured promotions carousel"
        >
          {posters.map((poster) => {
            const label = poster.altText ?? poster.product.name;

            return (
              <Link
                key={poster.id}
                href={productPath(poster.product)}
                className="poster-card reveal"
                aria-label={label}
              >
                <SafeImage
                  src={poster.imageUrl}
                  alt={label}
                  fill
                  className="poster-card-img"
                  sizes="(max-width: 640px) 62vw, (max-width: 1024px) 34vw, 22vw"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
