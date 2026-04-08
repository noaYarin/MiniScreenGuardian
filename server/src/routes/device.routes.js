import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { requireChild } from "../middlewares/requireChild.js";
import {
  lockDeviceController,
  unlockDeviceController,
  getDevicesByChildController,
  getDeviceScreenTimeController,
  updateDeviceScreenTimeController,
  setDeviceActiveController,
  getDevicePolicyController,
  getDeviceByChildController,
  deleteDeviceForChildController,
  blockApplicationController,
  unblockApplicationController,
  getDeviceDailyLimitController,
  updateDeviceDailyLimitController,
  getDeviceCurrentStatusForChildController,
  updateDeviceUsageByChildController,
  updateDeviceNameController,
  deviceHeartbeatController,
  updateDeviceLocationController
} from "../controllers/device.controller.js";

const router = Router();

// GET /api/v1/devices/child/:childId
// Parent gets all devices of specific child
router.get("/child/:childId", authJwt, requireParent, getDevicesByChildController);

// GET /api/v1/devices/child/:childId/:deviceId
// Parent gets a specific device of a specific child
router.get("/child/:childId/:deviceId", authJwt, requireParent, getDeviceByChildController);

router.patch("/child/:childId/:deviceId/name", authJwt, requireParent, updateDeviceNameController);

// DELETE /api/v1/devices/child/:childId/:deviceId
router.delete(
  "/child/:childId/:deviceId",
  authJwt,
  requireParent,
  deleteDeviceForChildController
);

// PATCH /api/v1/devices/:deviceId/lock
// Parent locks a device (blocks screen usage)
router.patch("/:deviceId/lock", authJwt, requireParent, lockDeviceController);

//PATCH /api/v1/devices/:deviceId/unlock
// Parent unlocks a device
router.patch("/:deviceId/unlock", authJwt, requireParent, unlockDeviceController);

// GET /api/v1/devices/:deviceId/policy
// Get device policy for child app
router.get("/:deviceId/policy", authJwt, requireChild, getDevicePolicyController);

//GET /api/v1/devices/:deviceId/screen-time
// Get current screen-time settings for a device
router.get("/:deviceId/screen-time", authJwt, requireParent, getDeviceScreenTimeController);

//PATCH /api/v1/devices/:deviceId/screen-time
// Update screen-time settings for a device
router.patch("/:deviceId/screen-time", authJwt, requireParent, updateDeviceScreenTimeController);

// GET /api/v1/devices/:deviceId/daily-limit
// Get current daily limit settings for a device
router.get("/:deviceId/daily-limit", authJwt, requireParent, getDeviceDailyLimitController);

// PATCH /api/v1/devices/:deviceId/daily-limit
// Update daily limit settings for a device
router.patch("/:deviceId/daily-limit", authJwt, requireParent, updateDeviceDailyLimitController);

// PATCH /api/v1/devices/:deviceId/active
// Parent activates/deactivates a device
router.patch("/:deviceId/active", authJwt, requireParent, setDeviceActiveController);

// PATCH /api/v1/devices/:deviceId/apps/:packageName/block
// Parent blocks an application on a specific device
router.patch("/:deviceId/apps/:packageName/block", authJwt, requireParent, blockApplicationController);

// PATCH /api/v1/devices/:deviceId/apps/:packageName/unblock
// Parent unblocks an application on a specific device
router.patch("/:deviceId/apps/:packageName/unblock", authJwt, requireParent, unblockApplicationController);

// GET /api/v1/devices/:deviceId/current-status
// Child gets current daily screen-time status for home screen
router.get(
  "/:deviceId/current-status",
  authJwt,
  requireChild,
  getDeviceCurrentStatusForChildController
);

// PATCH /api/v1/devices/:deviceId/location
// Parent updates the location of a device
router.patch("/:deviceId/location", authJwt, requireChild, updateDeviceLocationController);


// PATCH /api/v1/devices/:deviceId/usage
// Child app updates used screen-time minutes
router.patch(
  "/:deviceId/usage",
  authJwt,
  requireChild,
  updateDeviceUsageByChildController
);

// PATCH /api/v1/devices/:deviceId/heartbeat
// Child app sends heartbeat and protection status
router.patch(
  "/:deviceId/heartbeat",
  authJwt,
  requireChild,
  deviceHeartbeatController
);

export default router;