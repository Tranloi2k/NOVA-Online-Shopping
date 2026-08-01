"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { inter, sora } from "@/app/ui/fonts";
import ErrorBoundaryUI from "@/app/ui/error-boundary";

/**
 * Catches errors in the root layout. Must define its own <html> and <body>.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sora.variable} bg-shop-bg font-sans text-shop-text antialiased`}
      >
        <ErrorBoundaryUI
          error={error}
          reset={reset}
          variant="full"
          title="Application error"
          description="A critical error occurred. Reload the page or return to the Homepage."
          showProducts
        />
      </body>
    </html>
  );
}
