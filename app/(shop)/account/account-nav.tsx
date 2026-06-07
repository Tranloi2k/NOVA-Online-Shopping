"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/ui/nova/nova-icons";
import SignOutButton from "./sign-out-button";
import clsx from "clsx";

const NAV_ITEMS = [
  { icon: "box" as const, label: "Orders", href: "/account/orders", badge: null },
  { icon: "heart" as const, label: "Wishlist", href: "/account/wishlist", badge: null },
  { icon: "user" as const, label: "Profile", href: "/account/profile", badge: null },
  { icon: "shield" as const, label: "Security", href: "/account/security", badge: null },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="acct-nav">
      {NAV_ITEMS.map(({ icon, label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx("acct-nav-link", { "is-active": isActive })}
          >
            <Icon name={icon} size={18} />
            <span>{label}</span>
          </Link>
        );
      })}
      <SignOutButton />
    </nav>
  );
}
