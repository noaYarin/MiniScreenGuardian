import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import {
  addChildController,
  getChildrenController,
  setChildActiveController,
  getChildController,
  deleteChildController 
} from "../controllers/child.controller.js";
import { requireParent } from "../middlewares/requireParent.js";
import { getParentHomeSummaryController } from "../controllers/parent.controller.js";

const router = Router();

// POST /api/v1/parent/children
// Create new child
router.post("/children", authJwt, requireParent, addChildController);

// GET /api/v1/parent/children
// Get all children of parent
router.get("/children", authJwt, requireParent, getChildrenController);

// GET /api/v1/parent/children/:childId
// Get specific child
router.get("/children/:childId", authJwt, requireParent, getChildController);

// PATCH /api/v1/parent/children/:childId/active
// Activate/deactivate child
router.patch("/children/:childId/active", authJwt, requireParent, setChildActiveController);

// GET /api/v1/parent/home-summary
// Parent dashboard summary
router.get("/home-summary", authJwt, requireParent, getParentHomeSummaryController);

// DELETE /api/v1/parent/children/:childId
// Delete child
router.delete("/children/:childId", authJwt, requireParent, deleteChildController);
export default router;