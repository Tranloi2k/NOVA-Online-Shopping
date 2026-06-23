"use client";

import { useChat } from "@ai-sdk/react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || status !== "ready") return;

    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          className="flex w-[360px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
          style={{ height: 500 }}
          role="dialog"
          aria-label="AI assistant"
        >
          <header className="flex items-center justify-between border-b border-neutral-100 bg-neutral-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden />
              <div>
                <p className="text-sm font-semibold">NOVA Assistant</p>
                <p className="text-xs text-neutral-300">Shopping support 24/7</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-neutral-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-neutral-50 px-4 py-4">
            {messages.length === 0 && (
              <p className="text-center text-sm text-neutral-500">
                Hi! I can help you find products or answer questions about your
                orders.
              </p>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";
              const text = getMessageText(message);

              if (!text) return null;

              return (
                <div
                  key={message.id}
                  className={clsx("flex", isUser ? "justify-end" : "justify-start")}
                >
                  <div
                    className={clsx(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      isUser
                        ? "rounded-br-md bg-blue-600 text-white"
                        : "rounded-bl-md border border-neutral-200 bg-white text-neutral-900",
                    )}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <p className="text-sm text-neutral-500">AI is typing...</p>
            )}

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error.message}
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-neutral-100 bg-white px-3 py-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              disabled={status !== "ready"}
              className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status !== "ready" || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
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
