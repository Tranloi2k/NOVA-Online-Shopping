import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/lib/seo";
import { Icon } from "@/app/ui/nova/nova-icons";
import { NovaGlyph } from "@/app/ui/nova/nova-glyphs";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign in",
  description: "Sign in to your NOVA account to checkout and manage orders.",
  pathname: "/login",
  noIndex: true,
});

const perks = [
  ["truck", "Free 2-day shipping", "On every order, no minimum spend."],
  ["gift", "Members-only pricing", "Early access and exclusive drops."],
  ["refresh", "30-day easy returns", "Track orders and returns in one place."],
] as const;

export default function LoginPage() {
  return (
    <main className="auth-main">
      <div className="auth-shell">
        {/* Left editorial panel */}
        <aside className="auth-aside">
          <div className="auth-aside-top">
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
          </div>
          <div className="auth-aside-mid">
            <h2 className="auth-aside-title">
              Welcome back to
              <br />
              the good stuff.
            </h2>
            <p className="auth-aside-sub">
              Sign in to track orders, save your favourites and check out in
              seconds.
            </p>
            <ul className="auth-perks">
              {perks.map(([ic, t, d]) => (
                <li key={t}>
                  <span className="auth-perk-ic">
                    <Icon name={ic} size={18} />
                  </span>
                  <div>
                    <div className="auth-perk-t">{t}</div>
                    <div className="auth-perk-d">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="auth-aside-foot">
            <div className="auth-glyphs">
              {(["phone", "headphones", "watch", "laptop"] as const).map((g) => (
                <span key={g}>
                  <NovaGlyph type={g} />
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right form pane */}
        <section className="auth-pane">
          <div className="auth-form-wrap">
            <Link href="/" className="auth-back">
              <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}>
                <Icon name="arrow" size={16} />
              </span>{" "}
              Back to shop
            </Link>
            <h1 className="auth-title">Sign in</h1>
            <p className="auth-lead">
              New to NOVA?{" "}
              <Link href="/products" className="auth-link">
                Browse first
              </Link>
            </p>

            <Suspense>
              <LoginForm />
            </Suspense>

            <p className="auth-fine">
              <Icon name="lock" size={13} /> Your details are encrypted and
              never shared.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
