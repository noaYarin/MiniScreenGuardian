import logger from "../utils/logger.js";
import { Sentry } from "../config/sentry.js";

export function errorHandler(err, req, res, next) {
  const status = err?.status || 500;
  const code = err?.code || "SERVER_ERROR";
  const message = err?.message || "Something went wrong";

  Sentry.captureException(err);
  logger.error("Request error", { code, status, message, path: req.path });

  res.status(status).json({
    ok: false,
    error: { code, message },
  });
}