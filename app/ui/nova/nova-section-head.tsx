"use client";

import { Icon } from "@/app/ui/nova/nova-icons";

export function SectionHead({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="sec-head">
      <div>
        {eyebrow && (
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{ fontSize: "clamp(28px,3.6vw,44px)" }}>{title}</h2>
      </div>
      {action && onAction && (
        <button className="btn-link" onClick={onAction}>
          {action}{" "}
          <span className="arr">
            <Icon name="arrow" size={17} />
          </span>
        </button>
      )}
    </div>
  );
}
