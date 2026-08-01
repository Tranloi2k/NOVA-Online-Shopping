/** Production: 10% traces to limit main-thread overhead (TBT/INP). Dev: full sampling. */
export const SENTRY_TRACES_SAMPLE_RATE =
  process.env.NODE_ENV === "production" ? 0.1 : 1;
