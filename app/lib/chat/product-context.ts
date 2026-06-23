import type { ProductListItem } from "@/app/lib/definitions";
import { productPath } from "@/app/lib/product-path";
import { getProducts } from "@/app/lib/services/products";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatProductLine(product: ProductListItem): string {
  const url = productPath(product);
  const price = formatPrice(product.price);
  const discount =
    product.discount && product.discount > 0
      ? `, ${product.discount}% off`
      : "";
  const stock =
    product.stock !== undefined ? `, ${product.stock} in stock` : "";
  const rating =
    product.rating !== undefined
      ? `, rated ${product.rating}/5 (${product.reviewCount} reviews)`
      : "";

  return `- ${product.name} | ${price}${discount}${stock}${rating} | ${url}`;
}

export async function getProductCatalogSnapshot(limit = 24): Promise<string> {
  const result = await getProducts({ page: 1, limit });

  if (result.products.length === 0) {
    return "No product data available right now (API may be offline).";
  }

  const lines = result.products.map(formatProductLine);
  return [
    `${result.total} products total. Featured ${result.products.length} below:`,
    ...lines,
  ].join("\n");
}

export async function searchProductsForChat(input: {
  query?: string;
  category?: string;
  maxPrice?: number;
  onSale?: boolean;
  limit?: number;
}): Promise<string> {
  const result = await getProducts({
    query: input.query,
    category: input.category,
    maxPrice: input.maxPrice,
    onSale: input.onSale,
    page: 1,
    limit: input.limit ?? 8,
  });

  if (result.products.length === 0) {
    return "No products found matching the search criteria.";
  }

  return [
    `Found ${result.total} products. Showing ${result.products.length} results:`,
    ...result.products.map(formatProductLine),
  ].join("\n");
}
