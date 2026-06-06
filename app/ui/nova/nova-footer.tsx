import Link from "next/link";
import { categoryNavHref } from "@/app/lib/product-filters";

const cats = [
  { id: "smartphones", label: "Phones" },
  { id: "tablets", label: "Tablets" },
  { id: "wearables", label: "Wearables" },
  { id: "all", label: "All products" },
];

export default function NovaFooter() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 22,
                color: "#fff",
                letterSpacing: "-0.03em",
              }}
            >
              NOVA
            </span>
            <p
              className="muted"
              style={{
                marginTop: 16,
                maxWidth: 280,
                color: "rgba(255,255,255,.55)",
              }}
            >
              Premium tech, thoughtfully chosen. Free 2-day shipping and 30-day
              returns on everything.
            </p>
            <div className="foot-social">
              {["X", "in", "◎", "▶"].map((s, i) => (
                <span key={i} className="soc">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="foot-col">
            <h4>Shop</h4>
            {cats.map((c) => (
              <Link key={c.id} href={categoryNavHref(c.id)}>
                {c.label}
              </Link>
            ))}
          </div>

          <div className="foot-col">
            <h4>Support</h4>
            {["Contact us", "Shipping", "Returns", "Warranty", "Track order"].map(
              (s) => (
                <button key={s}>{s}</button>
              ),
            )}
          </div>

          <div className="foot-col">
            <h4>Company</h4>
            {["About NOVA", "Sustainability", "Careers", "Press", "Stores"].map(
              (s) => (
                <button key={s}>{s}</button>
              ),
            )}
          </div>
        </div>

        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} NOVA Shop. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 22 }}>
            {["Privacy", "Terms", "Cookies"].map((s) => (
              <button key={s}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
