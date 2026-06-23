import type { ProductListItem } from "@/app/lib/definitions";
import { productPath } from "@/app/lib/product-path";
import { getProducts } from "@/app/lib/services/products";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
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
      ? `, giảm ${product.discount}%`
      : "";
  const stock =
    product.stock !== undefined ? `, còn ${product.stock} sp` : "";
  const rating =
    product.rating !== undefined
      ? `, đánh giá ${product.rating}/5 (${product.reviewCount} review)`
      : "";

  return `- ${product.name} | ${price}${discount}${stock}${rating} | ${url}`;
}

export async function getProductCatalogSnapshot(limit = 24): Promise<string> {
  const result = await getProducts({ page: 1, limit });

  if (result.products.length === 0) {
    return "Không có dữ liệu sản phẩm lúc này (API có thể đang tắt).";
  }

  const lines = result.products.map(formatProductLine);
  return [
    `Tổng ${result.total} sản phẩm. Dưới đây là ${result.products.length} sản phẩm nổi bật:`,
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
    return "Không tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm.";
  }

  return [
    `Tìm thấy ${result.total} sản phẩm. Hiển thị ${result.products.length} kết quả:`,
    ...result.products.map(formatProductLine),
  ].join("\n");
}
