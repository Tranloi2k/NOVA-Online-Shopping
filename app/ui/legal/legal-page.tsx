import Link from "next/link";
import type { ReactNode } from "react";

const PROSE = [
  "mt-10 space-y-8 text-sm leading-relaxed text-shop-secondary",
  "[&_h2]:font-display [&_h2]:text-lg [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-shop-text [&_h2]:mb-3",
  "[&_p]:mt-3",
  "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
  "[&_a]:text-shop-text [&_a]:underline [&_a]:underline-offset-2",
  "[&_strong]:text-shop-text [&_strong]:font-medium",
  "[&_table]:mt-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left",
  "[&_th]:border-b [&_th]:border-shop-border [&_th]:py-2 [&_th]:pr-4 [&_th]:font-medium [&_th]:text-shop-text",
  "[&_td]:border-b [&_td]:border-shop-border [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top",
].join(" ");

/**
 * Shared shell for the static legal pages (Privacy, Terms, Cookies). Content is
 * passed as children using plain <section>/<h2>/<p>/<ul> — styling comes from the
 * PROSE arbitrary-variant classes so pages stay markup-only.
 */
export function LegalPage({
  eyebrow = "Legal",
  title,
  updated,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  updated: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="shop-content-wrap py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono-label text-shop-muted">{eyebrow}</p>
        <h1 className="font-display mt-3 text-display-md font-medium tracking-tight text-shop-text">
          {title}
        </h1>
        <p className="mt-3 text-sm text-shop-secondary">Last updated: {updated}</p>

        {intro && (
          <div className="mt-6 text-sm leading-relaxed text-shop-secondary">{intro}</div>
        )}

        <div className={PROSE}>{children}</div>

        <div className="shop-divider mt-12 flex flex-wrap gap-x-6 gap-y-2 pt-6 text-xs text-shop-muted">
          <Link href="/privacy" className="transition-colors hover:text-shop-text">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-shop-text">
            Terms of Service
          </Link>
          <Link href="/cookies" className="transition-colors hover:text-shop-text">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
