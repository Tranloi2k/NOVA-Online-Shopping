export function Stars({
  r,
  showNum = false,
  count,
}: {
  r: number;
  showNum?: boolean;
  count?: number;
}) {
  const full = Math.round(r);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span className="stars" aria-label={`${r} stars`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ opacity: i <= full ? 1 : 0.22 }}>
            ★
          </span>
        ))}
      </span>
      {showNum && (
        <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
          {r.toFixed(1)}
          {count != null && Number.isFinite(Number(count))
            ? ` · ${Number(count).toLocaleString()}`
            : ""}
        </span>
      )}
    </span>
  );
}
