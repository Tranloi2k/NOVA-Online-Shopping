import { NovaGlyph, type GlyphType } from "@/app/ui/nova/nova-glyphs";

export function DeviceTile({
  glyph,
  ratio = "1 / 1",
  big = false,
  glyphSize,
}: {
  glyph: GlyphType;
  ratio?: string;
  big?: boolean;
  glyphSize?: string;
}) {
  const gs = glyphSize ?? (big ? "min(58%, 360px)" : "64%");
  return (
    <div className="tile" style={{ aspectRatio: ratio, width: "100%" }}>
      <NovaGlyph
        type={glyph}
        style={{
          width: gs,
          color: "var(--ink)",
          opacity: 0.92,
          display: "grid",
          placeItems: "center",
          filter: "drop-shadow(0 18px 30px rgba(20,24,40,.12))",
        }}
      />
    </div>
  );
}
