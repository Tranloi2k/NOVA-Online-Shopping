"use client";
import { signOut } from "next-auth/react";
import { Icon } from "@/app/ui/nova/nova-icons";

export default function SignOutButton() {
  return (
    <button
      className="acct-nav-link logout"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <Icon name="logout" size={18} />
      <span>Sign out</span>
    </button>
  );
}
