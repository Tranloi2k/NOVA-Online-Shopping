// This file configures the initialization of Sentry in the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { SENTRY_TRACES_SAMPLE_RATE } from "@/app/lib/sentry-sampling";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },

  // Optional next step: Session Replay — add Sentry.replayIntegration()
  // plus replaysSessionSampleRate / replaysOnErrorSampleRate.
});

// Capture App Router client-side navigation as spans.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
