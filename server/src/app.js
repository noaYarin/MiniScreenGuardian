import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import parentRoutes from "./routes/parent.routes.js";
import pairingRoutes from "./routes/pairing.routes.js";
import deviceRouter from "./routes/device.routes.js";
import requestRoutes from "./routes/request.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import childRoutes from "./routes/child.routes.js";
import auditRoutes from "./routes/audit.route.js";


const app = express();
// Maximum allowed characters 
app.use(express.json({ limit: '5mb' }));

app.use(cors());
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/parent", parentRoutes);
app.use("/api/v1/pairing", pairingRoutes);
app.use("/api/v1/devices", deviceRouter);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/child", childRoutes);
app.use("/api/v1/audit", auditRoutes);

app.use(errorHandler);

export default app;