import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/app/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/ui/nova/nova-icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "My Account",
  description: "Manage your NOVA account.",
  pathname: "/account",
  noIndex: true,
});

const NAV_ITEMS = [
  { icon: "box" as const, label: "Orders", href: "/account/orders", badge: null },
  { icon: "heart" as const, label: "Wishlist", href: "/account/wishlist", badge: null },
  { icon: "user" as const, label: "Profile", href: "/account/profile", badge: null },
  { icon: "shield" as const, label: "Security", href: "/account/security", badge: null },
];

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;
  const initials = user.name
    ? user.name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : (user.email?.[0]?.toUpperCase() ?? "N");

  return (
    <>
      {/* Banner */}
      <div className="acct-banner">
        <div className="acct-banner-avatar">{initials}</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--muted)" }}>
            Welcome back
          </div>
          <h1 className="acct-h1" style={{ marginTop: 4 }}>
            {user.name ?? user.email}
          </h1>
          <div className="acct-tier" style={{ marginTop: 6, fontSize: 13.5 }}>
            Nova Member
          </div>
        </div>
      </div>

      {/* Quick links grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 14,
        }}
      >
        {NAV_ITEMS.map(({ icon, label, href }) => (
          <Link key={href} href={href} className="acct-card" style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--r-md)",
                background: "var(--accent-wash)",
                color: "var(--accent-ink)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={icon} size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
                {label}
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                Manage your {label.toLowerCase()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
