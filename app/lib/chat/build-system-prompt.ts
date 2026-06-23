import { formatSiteKnowledge } from "@/app/lib/chat/site-knowledge";
import { getProductCatalogSnapshot } from "@/app/lib/chat/product-context";

const BASE_INSTRUCTIONS = `Bạn là trợ lý ảo của cửa hàng NOVA — trang E-commerce bán thiết bị công nghệ cao cấp.

Nhiệm vụ:
- Tư vấn sản phẩm phù hợp nhu cầu và ngân sách
- Giải đáp chính sách giao hàng, đổi trả, bảo hành, thanh toán
- Hướng dẫn khách đến đúng trang trên website

Phong cách: ngắn gọn, lịch sự, thân thiện, bằng tiếng Việt.`;

export async function buildChatSystemPrompt(): Promise<string> {
  const [knowledge, catalog] = await Promise.all([
    Promise.resolve(formatSiteKnowledge()),
    getProductCatalogSnapshot(),
  ]);

  return [
    BASE_INSTRUCTIONS,
    "",
    "---",
    "KIẾN THỨC CỬA HÀNG (cập nhật từ website):",
    knowledge,
    "",
    "---",
    "DANH SÁCH SẢN PHẨM (snapshot):",
    catalog,
    "",
    "---",
    "Khi khách hỏi sản phẩm cụ thể hoặc tìm theo giá/danh mục, hãy dùng tool searchProducts để lấy dữ liệu mới nhất.",
  ].join("\n");
}
