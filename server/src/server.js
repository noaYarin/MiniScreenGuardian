import http from "http";
import "./config/env.js";
import "./config/sentry.js";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectMongo } from "./config/mongo.js";
import logger from "./utils/logger.js";
import { Sentry } from "./config/sentry.js";
import { initSocket } from "./socketHandler.js";

async function bootstrap() {
  await connectMongo();

  // app.listen(env.PORT, "0.0.0.0", () =>
  //   logger.info(`Server running on port ${env.PORT}`)
  // );

  const httpServer = http.createServer(app);
  initSocket(httpServer);
  httpServer.listen(env.PORT, () => logger.info(`Server running on port ${env.PORT}`));
}

bootstrap().catch((err) => {
  Sentry.captureException(err);
  logger.error("Failed to start server", { err: err.message, stack: err.stack });
  process.exit(1);
});