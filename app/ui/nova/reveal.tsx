"use client";

import clsx from "clsx";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

let revealReadyQueued = false;

function queueRevealReady() {
  if (revealReadyQueued || typeof document === "undefined") return;
  revealReadyQueued = true;
  requestAnimationFrame(() => {
    document.documentElement.classList.add("reveal-ready");
  });
}

type RevealProps<T extends ElementType = "div"> = {
  as?: T;
  index?: number;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children" | "index">;

export function Reveal<T extends ElementType = "div">({
  as,
  index = 0,
  className,
  children,
  style,
  ...rest
}: RevealProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    queueRevealReady();
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.95 && rect.bottom > -40) {
        setRevealed(true);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const revealStyle = revealed
    ? { ...style, transitionDelay: `${Math.min(index, 6) * 55}ms` }
    : style;

  return (
    <Component
      ref={ref}
      className={clsx("reveal", revealed && "in", className)}
      style={revealStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}
