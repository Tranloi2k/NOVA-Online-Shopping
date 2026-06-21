export function ProductCardSkeleton() {
  return (
    <div className="card prod-card">
      <div className="tile" style={{ aspectRatio: "4 / 3" }}>
        <div className="h-full w-full animate-pulse bg-shop-surface-muted" />
      </div>
      <div className="prod-body space-y-3">
        <div className="h-[18px] w-3/4 animate-pulse rounded bg-shop-surface-muted" style={{ marginTop: 3 }} />
        <div className="h-3 w-1/2 animate-pulse rounded bg-shop-surface-muted" style={{ marginTop: 7 }} />
        <div className="prod-foot" style={{ marginTop: 16 }}>
          <div className="h-6 w-1/3 animate-pulse rounded bg-shop-surface-muted" />
          <div className="h-[38px] w-[38px] animate-pulse rounded-full bg-shop-surface-muted" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="prod-grid" style={{ marginTop: 28 }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square rounded-shop-lg bg-shop-surface-muted" />
        <div className="mt-8 space-y-4 lg:mt-0">
          <div className="h-8 w-2/3 rounded-sm bg-shop-surface-muted" />
          <div className="h-4 w-1/3 rounded-sm bg-shop-surface-muted" />
          <div className="h-20 rounded-sm bg-shop-surface-muted" />
          <div className="h-12 rounded-shop bg-shop-surface-muted" />
        </div>
      </div>
    </div>
  );
}
