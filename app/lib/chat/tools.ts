import { searchProductsForChat } from "@/app/lib/chat/product-context";
import { PRODUCT_CATEGORIES } from "@/app/lib/product-filters";
import { z } from "zod";

const categoryIds = PRODUCT_CATEGORIES.filter((c) => c.id !== "all").map(
  (c) => c.id,
);

export const chatTools = {
  searchProducts: {
    description:
      "Search the NOVA catalog by keyword, category, max price, or on-sale items.",
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe("Search keyword, e.g. iPhone, headphones, laptop"),
      category: z
        .enum(categoryIds as [string, ...string[]])
        .optional()
        .describe(
          "Category: smartphones, tablets, wearables, audio, laptops, accessories",
        ),
      maxPrice: z.number().optional().describe("Maximum price in USD"),
      onSale: z.boolean().optional().describe("Only show discounted products"),
    }),
    execute: async (input: {
      query?: string;
      category?: string;
      maxPrice?: number;
      onSale?: boolean;
    }) => searchProductsForChat(input),
  },
};
