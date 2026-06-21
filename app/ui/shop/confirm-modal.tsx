"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ShopButton } from "@/app/ui/shop/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Set mounted on client side
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-shop-text/40 p-4 animate-confirm-backdrop"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-sm overflow-hidden rounded-shop-lg border border-shop-border bg-shop-surface p-6 shadow-shop-lg animate-confirm-modal"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-shop p-1 text-shop-muted transition-colors hover:bg-shop-surface-muted hover:text-shop-text disabled:opacity-50"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <h3 className="font-display text-lg font-bold text-shop-text pr-6">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-shop-secondary">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <ShopButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="!h-10 border border-shop-border hover:bg-shop-surface-muted"
          >
            {cancelText}
          </ShopButton>
          <ShopButton
            type="button"
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="!h-10 !bg-shop-error hover:!bg-red-700 text-white min-w-[90px]"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              confirmText
            )}
          </ShopButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
