export type GlyphType =
  | "laptop" | "phone" | "headphones" | "watch"
  | "tablet" | "earbuds" | "speaker" | "keyboard";

const glyphs: Record<GlyphType, string> = {
  laptop: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="24" width="100" height="62" rx="7" stroke="currentColor" stroke-width="3.2"/><rect x="41" y="34" width="78" height="42" rx="3" fill="currentColor" opacity=".08"/><path d="M18 92h124l-7 9a6 6 0 0 1-5 3H30a6 6 0 0 1-5-3l-7-9Z" fill="currentColor" opacity=".9"/><rect x="68" y="92" width="24" height="4" rx="2" fill="#fff" opacity=".5"/></svg>`,
  phone: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="58" y="14" width="44" height="92" rx="11" stroke="currentColor" stroke-width="3.2"/><rect x="64" y="22" width="32" height="68" rx="4" fill="currentColor" opacity=".08"/><rect x="72" y="17.5" width="16" height="3" rx="1.5" fill="currentColor" opacity=".5"/><circle cx="80" cy="98" r="3" fill="currentColor" opacity=".5"/></svg>`,
  headphones: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 78V62a40 40 0 0 1 80 0v16" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><rect x="32" y="72" width="20" height="34" rx="8" fill="currentColor" opacity=".9"/><rect x="108" y="72" width="20" height="34" rx="8" fill="currentColor" opacity=".9"/></svg>`,
  watch: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="58" y="34" width="44" height="52" rx="13" stroke="currentColor" stroke-width="3.2"/><rect x="65" y="41" width="30" height="38" rx="8" fill="currentColor" opacity=".1"/><path d="M66 34l4-18h20l4 18M66 86l4 18h20l4-18" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="105" cy="60" r="2.6" fill="currentColor"/></svg>`,
  tablet: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="46" y="16" width="68" height="88" rx="9" stroke="currentColor" stroke-width="3.2"/><rect x="54" y="24" width="52" height="68" rx="4" fill="currentColor" opacity=".08"/><circle cx="80" cy="98" r="3" fill="currentColor" opacity=".5"/></svg>`,
  earbuds: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M62 40c0 18-8 26-8 40 0 8 6 12 12 8 8-6 8-20 6-34" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="M98 40c0 18 8 26 8 40 0 8-6 12-12 8-8-6-8-20-6-34" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><circle cx="62" cy="38" r="9" fill="currentColor" opacity=".9"/><circle cx="98" cy="38" r="9" fill="currentColor" opacity=".9"/></svg>`,
  speaker: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="56" y="20" width="48" height="80" rx="14" stroke="currentColor" stroke-width="3.2"/><circle cx="80" cy="68" r="15" fill="currentColor" opacity=".12"/><circle cx="80" cy="68" r="6" fill="currentColor" opacity=".9"/><circle cx="80" cy="36" r="3" fill="currentColor" opacity=".5"/></svg>`,
  keyboard: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="40" width="116" height="44" rx="8" stroke="currentColor" stroke-width="3.2"/><g fill="currentColor" opacity=".75"><rect x="32" y="50" width="9" height="9" rx="2"/><rect x="46" y="50" width="9" height="9" rx="2"/><rect x="60" y="50" width="9" height="9" rx="2"/><rect x="74" y="50" width="9" height="9" rx="2"/><rect x="88" y="50" width="9" height="9" rx="2"/><rect x="102" y="50" width="9" height="9" rx="2"/><rect x="116" y="50" width="9" height="9" rx="2"/><rect x="48" y="66" width="64" height="9" rx="2"/></g></svg>`,
};

export function NovaGlyph({
  type,
  className,
  style,
}: {
  type: GlyphType;
  className?: string;
  style?: React.CSSProperties;
}) {
  const svg = glyphs[type] ?? glyphs.laptop;
  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function getGlyph(type: GlyphType): string {
  return glyphs[type] ?? glyphs.laptop;
}
