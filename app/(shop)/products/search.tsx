"use client";

import { Icon } from "@/app/ui/nova/nova-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(
    searchParams.get("query")?.toString() || "",
  );

  function search() {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
      <div style={{ position: "relative", flex: 1 }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
            pointerEvents: "none",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name="search" size={18} sw={1.8} />
        </span>
        <input
          className="input"
          style={{ paddingLeft: 42 }}
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          aria-label="Search products"
        />
      </div>
      <button type="button" className="btn btn-ghost" onClick={search}>
        Search
      </button>
    </div>
  );
}
