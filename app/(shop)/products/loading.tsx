import { ProductGridSkeleton } from "@/app/ui/shop/skeletons";
import Link from "next/link";

export default function Loading() {
  return (
    <main>
      {/* Static Hero — title and navigation are known without API */}
      <div className="shop-hero">
        <div className="wrap">
          <nav className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Products</span>
          </nav>
          <h1 style={{ fontSize: "clamp(32px,4.4vw,54px)", marginTop: 10 }}>
            All products
          </h1>
          {/* Product count comes from API → skeleton */}
          <div className="mt-3 h-4 w-64 animate-pulse rounded-sm bg-shop-border-subtle" />
        </div>
      </div>

      {/* Body */}
      <div className="wrap shop-body">
        {/* Toolbar and search are client-side UI, not API-driven — render empty space matching height */}
        <div className="mb-7 h-11" />

        {/* Only the product grid is API data → skeleton */}
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}

