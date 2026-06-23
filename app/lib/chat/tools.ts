import { searchProductsForChat } from "@/app/lib/chat/product-context";
import { PRODUCT_CATEGORIES } from "@/app/lib/product-filters";
import { z } from "zod";

const categoryIds = PRODUCT_CATEGORIES.filter((c) => c.id !== "all").map(
  (c) => c.id,
);

export const chatTools = {
  searchProducts: {
    description:
      "Tìm sản phẩm trong catalog NOVA theo từ khóa, danh mục, giá tối đa hoặc đang giảm giá.",
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe("Từ khóa tìm kiếm, ví dụ: iPhone, tai nghe, laptop"),
      category: z
        .enum(categoryIds as [string, ...string[]])
        .optional()
        .describe("Danh mục: smartphones, tablets, wearables, audio, laptops, accessories"),
      maxPrice: z
        .number()
        .optional()
        .describe("Giá tối đa (USD)"),
      onSale: z
        .boolean()
        .optional()
        .describe("Chỉ lấy sản phẩm đang giảm giá"),
    }),
    execute: async (input: {
      query?: string;
      category?: string;
      maxPrice?: number;
      onSale?: boolean;
    }) => searchProductsForChat(input),
  },
};
