import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { getParentAuditLogsController } from "../controllers/audit.controller.js";

const router = Router();


// GET /api/v1/audit/parent
// GET /api/v1/audit/parent?childId=...
router.get(
  "/parent", authJwt, requireParent, getParentAuditLogsController);
export default router;