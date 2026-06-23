"use client";

import { useEffect, useRef, RefObject } from "react";

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active: boolean,
  onClose?: () => void
): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
      return;
    }

    // Save current active element to restore later
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    const getFocusableElements = () => {
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
    };

    // Focus the first element after a short timeout to let the DOM settle
    const focusTimer = setTimeout(() => {
      const visibleElements = getFocusableElements();
      if (visibleElements.length > 0) {
        visibleElements[0].focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const visibleElements = getFocusableElements();
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
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, onClose]);

  return containerRef;
}
