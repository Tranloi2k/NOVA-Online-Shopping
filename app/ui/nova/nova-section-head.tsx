export function SectionHead({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
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
    </div>
  );
}
