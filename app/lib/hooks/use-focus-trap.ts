"use client";

import { useEffect, useRef, RefObject } from "react";

function getVisibleFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelector =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  const elements = container.querySelectorAll<HTMLElement>(focusableSelector);
  return Array.from(elements).filter((el) => {
    const style = window.getComputedStyle(el);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      el.offsetWidth > 0 &&
      el.offsetHeight > 0
    );
  });
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active: boolean,
  onClose?: () => void
): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Initial focus + restore — only when trap opens/closes, not on parent re-renders.
  useEffect(() => {
    if (!active) {
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
      return;
    }

    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    const focusTimer = setTimeout(() => {
      const visibleElements = getVisibleFocusableElements(container);
      if (visibleElements.length > 0) {
        visibleElements[0].focus();
      }
    }, 50);

    return () => clearTimeout(focusTimer);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onCloseRef.current) {
        onCloseRef.current();
        return;
      }

      if (e.key !== "Tab") return;

      const visibleElements = getVisibleFocusableElements(container);
      if (visibleElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = visibleElements[0];
      const lastElement = visibleElements[visibleElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return containerRef;
}
