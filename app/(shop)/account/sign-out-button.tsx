"use client";
import { signOut } from "next-auth/react";
import { Icon } from "@/app/ui/nova/nova-icons";
import { useState } from "react";
import { ConfirmModal } from "@/app/ui/shop/confirm-modal";

export default function SignOutButton() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        className="acct-nav-link logout"
        onClick={() => setShowConfirmModal(true)}
      >
        <Icon name="logout" size={18} />
        <span>Sign out</span>
      </button>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleLogout}
        title="Sign out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign out"
        isLoading={isLoggingOut}
      />
    </>
  );
}
