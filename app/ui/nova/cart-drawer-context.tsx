"use client";

import { createContext, useContext, useState } from "react";

type CartDrawerCtx = {
  isOpen: boolean;
  hasOpened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CartDrawerContext = createContext<CartDrawerCtx>({
  isOpen: false,
  hasOpened: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const open = () => {
    setHasOpened(true);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const toggle = () => {
    setIsOpen((v) => {
      if (!v) setHasOpened(true);
      return !v;
    });
  };

  return (
    <CartDrawerContext.Provider
      value={{
        isOpen,
        hasOpened,
        open,
        close,
        toggle,
      }}
    >
      {children}
    </CartDrawerContext.Provider>
  );
}

export function useCartDrawer() {
  return useContext(CartDrawerContext);
}
