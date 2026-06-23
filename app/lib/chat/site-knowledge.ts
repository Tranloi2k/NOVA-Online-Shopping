import { CATEGORY_NAV_ITEMS } from "@/app/lib/product-filters";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/app/lib/seo";

/**
 * Chỉnh sửa file này để "đào tạo" AI hiểu thông tin cố định của cửa hàng.
 * Đây là nguồn kiến thức chính — cập nhật khi chính sách, FAQ hoặc thông tin công ty thay đổi.
 */
export const SITE_KNOWLEDGE = {
  brand: {
    name: SITE_NAME,
    tagline: SITE_TAGLINE,
    description: DEFAULT_DESCRIPTION,
  },
  categories: CATEGORY_NAV_ITEMS.map((c) => c.label),
  policies: {
    shipping:
      "Miễn phí giao hàng 2 ngày cho mọi đơn hàng, không yêu cầu đơn tối thiểu. Đơn đặt trước 14:00 sẽ giao trong ngày.",
    returns:
      "Đổi trả miễn phí trong 30 ngày. Hoàn tiền đầy đủ nếu không hài lòng.",
    warranty:
      "Bảo hành 2 năm cho tất cả thiết bị NOVA, bao gồm lỗi sản xuất.",
    support:
      "Hỗ trợ khách hàng 7 ngày/tuần qua chat, email và hotline.",
    payment:
      "Thanh toán an toàn qua Stripe (thẻ tín dụng/ghi nợ). Hỗ trợ đăng nhập Google.",
  },
  pages: {
    products: "/products",
    cart: "/cart",
    account: "/account",
    login: "/login",
    checkout: "Thanh toán qua Stripe sau khi thêm sản phẩm vào giỏ.",
  },
  faq: [
    {
      q: "Làm sao để theo dõi đơn hàng?",
      a: "Đăng nhập tài khoản, vào mục Account > Orders để xem trạng thái đơn.",
    },
    {
      q: "Có được đổi trả không?",
      a: "Có, trong vòng 30 ngày kể từ ngày nhận hàng, miễn phí vận chuyển đổi trả.",
    },
    {
      q: "Phí ship bao nhiêu?",
      a: "Miễn phí giao hàng 2 ngày cho tất cả đơn hàng.",
    },
  ],
  rules: [
    "Chỉ trả lời dựa trên thông tin cửa hàng NOVA được cung cấp trong ngữ cảnh.",
    "Nếu không chắc chắn hoặc thiếu dữ liệu, hãy nói rõ và gợi ý khách liên hệ hỗ trợ.",
    "Không bịa giá, tồn kho hay chính sách không có trong dữ liệu.",
    "Gợi ý link trang /products khi khách muốn xem thêm sản phẩm.",
  ],
} as const;

export function formatSiteKnowledge(): string {
  const { brand, categories, policies, pages, faq, rules } = SITE_KNOWLEDGE;

  const faqBlock = faq.map((item) => `- Hỏi: ${item.q}\n  Đáp: ${item.a}`).join("\n");

  return [
    `## Thương hiệu`,
    `- Tên: ${brand.name}`,
    `- Slogan: ${brand.tagline}`,
    `- Mô tả: ${brand.description}`,
    ``,
    `## Danh mục sản phẩm`,
    categories.map((c) => `- ${c}`).join("\n"),
    ``,
    `## Chính sách`,
    `- Giao hàng: ${policies.shipping}`,
    `- Đổi trả: ${policies.returns}`,
    `- Bảo hành: ${policies.warranty}`,
    `- Hỗ trợ: ${policies.support}`,
    `- Thanh toán: ${policies.payment}`,
    ``,
    `## Trang quan trọng`,
    `- Sản phẩm: ${pages.products}`,
    `- Giỏ hàng: ${pages.cart}`,
    `- Tài khoản: ${pages.account}`,
    `- Đăng nhập: ${pages.login}`,
    `- Checkout: ${pages.checkout}`,
    ``,
    `## FAQ`,
    faqBlock,
    ``,
    `## Quy tắc trả lời`,
    rules.map((r) => `- ${r}`).join("\n"),
  ].join("\n");
}
