import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireChild } from "../middlewares/requireChild.js";
import { requireParent } from "../middlewares/requireParent.js";
import {
  createRequestController,
  getPendingRequestsController,
  decideRequestController,
  getMyRequestsController,
} from "../controllers/request.controller.js";

const router = Router();

// Child routes
router.use("/child", authJwt, requireChild);

// POST /api/v1/requests/child
// Child creates a new screen-time extension request
router.post("/child", createRequestController);

// GET /api/v1/requests/child
// Child gets their own requests
router.get("/child", getMyRequestsController);

// Parent routes
router.use("/parent", authJwt, requireParent);

// GET /api/v1/requests/parent/pending
// Parent gets all pending requests for their children
router.get("/parent/pending", getPendingRequestsController);

// PATCH /api/v1/requests/parent/:requestId/decision
// Parent approves or rejects a request
router.patch("/parent/:requestId/decision", decideRequestController);

export default router;