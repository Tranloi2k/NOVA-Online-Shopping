import { formatSiteKnowledge } from "@/app/lib/chat/site-knowledge";
import { getProductCatalogSnapshot } from "@/app/lib/chat/product-context";

const BASE_INSTRUCTIONS = `You are the virtual assistant for NOVA — a premium tech e-commerce store.

Your tasks:
- Recommend products that match the customer's needs and budget
- Answer questions about shipping, returns, warranty, and payment
- Guide customers to the right pages on the website

Style: concise, polite, friendly. Always respond in English.`;

export async function buildChatSystemPrompt(): Promise<string> {
  const [knowledge, catalog] = await Promise.all([
    Promise.resolve(formatSiteKnowledge()),
    getProductCatalogSnapshot(),
  ]);

  return [
    BASE_INSTRUCTIONS,
    "",
    "---",
    "STORE KNOWLEDGE (from website):",
    knowledge,
    "",
    "---",
    "PRODUCT CATALOG (snapshot):",
    catalog,
    "",
    "---",
    "When the customer asks about specific products or wants to filter by price/category, use the searchProducts tool for the latest data.",
  ].join("\n");
}
