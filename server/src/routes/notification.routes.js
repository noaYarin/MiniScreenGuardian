import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";

import {
  getParentNotificationsController,
  readAllNotificationsController,
  markNotificationAsReadController,
  deleteParentNotificationController,
} from "../controllers/notification.controller.js";

const router = Router();

 //GET /api/v1/notifications/parent
// Get notifications for parent
router.get("/parent", authJwt, requireParent, getParentNotificationsController);

 //PATCH /api/v1/notifications/parent/:notificationId/read
// Mark notification as read
router.patch("/parent/:notificationId/read", authJwt, requireParent, markNotificationAsReadController);

// PATCH /api/v1/notifications/parent/read-all
// Mark all parent notifications as read
router.patch("/parent/read-all", authJwt, requireParent, readAllNotificationsController);

// DELETE /api/v1/notifications/parent/:notificationId
router.delete(
  "/parent/:notificationId",
  authJwt,
  requireParent,
  deleteParentNotificationController
);

export default router;