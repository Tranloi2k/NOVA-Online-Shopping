"use client";

import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    const run = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > -40) el.classList.add("in");
      });
    };

    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
    els.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i, 6) * 55 + "ms";
    });

    run();

    const a = requestAnimationFrame(() => {
      document.documentElement.classList.add("reveal-ready");
      run();
    });

    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);

    return () => {
      window.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
      cancelAnimationFrame(a);
    };
  });
}
