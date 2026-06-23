"use client";

import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import dynamic from "next/dynamic";

const AIChatbotPanel = dynamic(() => import("@/components/AIChatbotPanel"), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-[360px] items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-2xl"
      style={{ height: 500 }}
      aria-busy="true"
      aria-label="Loading chat"
    >
      <p className="text-sm text-neutral-500">Loading assistant...</p>
    </div>
  ),
});

export default function AIChatbotLazy() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const open = () => {
    setHasOpened(true);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && hasOpened && <AIChatbotPanel onClose={close} />}

      <button
        type="button"
        onClick={() => (isOpen ? close() : open())}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
