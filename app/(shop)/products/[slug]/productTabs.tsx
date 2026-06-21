"use client";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import type { ProductReview } from "@/app/lib/definitions";

interface ProductTabsProps {
  productDetail: Record<string, unknown> | null;
  reviews: ProductReview[] | undefined;
  productRate: number;
  reviewCount: number;
}

type Tab = "specs" | "ship" | "reviews";

export default function ProductTabs({
  productDetail,
  reviews,
  productRate,
  reviewCount,
}: ProductTabsProps) {
  const [tab, setTab] = useState<Tab>("specs");

  const tabs: [Tab, string][] = [
    ["specs", "Specifications"],
    ["ship", "Shipping & returns"],
    ["reviews", "Reviews"],
  ];

  const totalReviews = reviews && reviews.length > 0 ? reviews.length : reviewCount;
  const averageRating = (() => {
    if (reviews && reviews.length > 0) {
      const avg =
        reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;
      if (Number.isFinite(avg)) return avg;
    }
    const fallback = Number(productRate);
    return Number.isFinite(fallback) ? fallback : 0;
  })();

  return (
    <div className="pdp-tabs">
      <div className="tab-row">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            className={`tab${tab === id ? " is-active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        {tab === "specs" && (
          (() => {
            const entries = productDetail
              ? Object.entries(productDetail).filter(([, v]) => !Array.isArray(v))
              : [];

            if (entries.length === 0) {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    padding: "48px 0",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "var(--r-md)",
                      background: "var(--surface)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--muted-2)",
                    }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
                      Specifications coming soon
                    </p>
                    <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>
                      Detailed specs for this product are being updated.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div className="spec-grid">
                {entries.map(([k, v]) => (
                  <div className="spec-item" key={k}>
                    <span className="muted" style={{ textTransform: "capitalize" }}>
                      {k}
                    </span>
                    <span style={{ fontWeight: 700 }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            );
          })()
        )}

        {tab === "ship" && (
          <div className="ship-body">
            <p>
              <strong>Free 2-day shipping</strong> on every order — no minimum.
              Orders placed before 2pm ship the same day.
            </p>
            <p>
              <strong>30-day returns.</strong> Changed your mind? Send it back
              free within 30 days for a full refund.
            </p>
            <p>
              <strong>2-year warranty</strong> covers all Nova devices against
              manufacturing defects.
            </p>
          </div>
        )}

        {tab === "reviews" && (
          <div>
            {reviews && reviews.length > 0 ? (
              <>
                <div className="rev-summary">
                  <div className="rev-big">{averageRating.toFixed(1)}</div>
                  <div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((r) =>
                        r <= Math.floor(averageRating) ? (
                          <StarIcon
                            key={r}
                            style={{ width: 14, height: 14, color: "var(--ink)" }}
                          />
                        ) : (
                          <StarOutlineIcon
                            key={r}
                            style={{ width: 14, height: 14, color: "var(--hair)" }}
                          />
                        ),
                      )}
                    </div>
                    <div
                      className="muted"
                      style={{ fontSize: 13.5, marginTop: 4 }}
                    >
                      Average review · {totalReviews.toLocaleString()} reviews
                    </div>
                  </div>
                </div>
                {reviews.map((review: ProductReview, i: number) => (
                  <div className="rev-item" key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>
                        {review.name || "Anonymous"}
                      </span>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((r) =>
                          r <= Math.floor(Number(review.rating)) ? (
                            <StarIcon
                              key={r}
                              style={{ width: 12, height: 12, color: "var(--ink)" }}
                            />
                          ) : (
                            <StarOutlineIcon
                              key={r}
                              style={{ width: 12, height: 12, color: "var(--hair)" }}
                            />
                          ),
                        )}
                      </div>
                    </div>
                    <p className="muted" style={{ fontSize: 14.5, marginTop: 6 }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <p className="muted" style={{ fontSize: 15 }}>
                No reviews yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
