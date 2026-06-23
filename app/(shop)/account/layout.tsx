import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AccountNav from "./account-nav";
import "@/app/ui/account.css";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="acct-main">
      <div className="wrap">
        <div className="acct-grid">
          {/* Sidebar */}
          <aside className="acct-side">
            <div className="acct-id">
              <div className="acct-avatar">{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div className="acct-name">{user.name ?? "Account"}</div>
                <div className="acct-email">{user.email}</div>
              </div>
            </div>
            <AccountNav />
          </aside>

          {/* Main content */}
          <div className="acct-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
