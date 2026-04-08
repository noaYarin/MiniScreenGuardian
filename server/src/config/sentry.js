import * as Sentry from "@sentry/node";
import { env } from "./env.js";

function initSentry() {
  if (!env.SENTRY_DSN) return;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.1,
  });
}

initSentry();

export { Sentry };
