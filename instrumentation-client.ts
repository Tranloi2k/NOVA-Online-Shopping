import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 100% of transactions in dev, 10% in production.
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Only send events when a DSN is configured (keeps local/dev noise-free).
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  // Optional next steps (not enabled by default):
  //   Session Replay — add Sentry.replayIntegration() + the replay*SampleRate options
  //   Logging        — set enableLogs: true and use Sentry.logger.*
  // See references/sdks/nextjs/session-replay.md and logging.md.
});

// Capture App Router client-side navigation as spans.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
