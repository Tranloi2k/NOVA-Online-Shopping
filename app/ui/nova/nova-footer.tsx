import Link from "next/link";
import { categoryNavHref, CATEGORY_NAV_ITEMS } from "@/app/lib/product-filters";

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
              {[
                { name: "X", label: "NOVA on X", icon: "X" },
                { name: "LinkedIn", label: "NOVA on LinkedIn", icon: "in" },
                { name: "Instagram", label: "NOVA on Instagram", icon: "◎" },
                { name: "YouTube", label: "NOVA on YouTube", icon: "▶" },
              ].map((s) => (
                <a key={s.name} href="#" className="soc" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="foot-col">
            <h2>Shop</h2>
            {CATEGORY_NAV_ITEMS.map((c) => (
              <Link key={c.id} href={categoryNavHref(c.id)}>
                {c.label}
              </Link>
            ))}
            <Link href={categoryNavHref("all")}>All products</Link>
          </div>

          <div className="foot-col">
            <h2>Support</h2>
            {[
              { name: "Contact us", href: "/contact" },
              { name: "Shipping", href: "/shipping" },
              { name: "Returns", href: "/returns" },
              { name: "Warranty", href: "/warranty" },
              { name: "Track order", href: "/orders" },
            ].map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="foot-col">
            <h2>Company</h2>
            {[
              { name: "About NOVA", href: "/about" },
              { name: "Sustainability", href: "/sustainability" },
              { name: "Careers", href: "/careers" },
              { name: "Press", href: "/press" },
              { name: "Stores", href: "/stores" },
            ].map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} NOVA Shop. All rights reserved.
          </span>
          <div className="foot-bottom-links">
            {[
              { name: "Privacy", href: "/privacy" },
              { name: "Terms", href: "/terms" },
              { name: "Cookies", href: "/cookies" },
            ].map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
