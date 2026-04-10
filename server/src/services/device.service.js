import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { notifyChild, notifyParent } from "./notification.service.js";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { sendAuditLog } from "./audit.service.js";
import { AuditActionType } from "../constants/auditActionType.js";
import {
  findDeviceById,
  updateDeviceById,
  findDevicesByChildId,
  deleteDeviceById,
  resetDailyScreenTime,
  updateApplicationBlockStatus,
  findDeviceDailyLimitById,
  updateDeviceDailyLimit,
  findDeviceStatusById,
  updateDeviceUsedTodayMinutes,
  updateDeviceHeartbeat,

} from "../dal/device.dal.js";
import { getChildrenByParentId } from "../dal/parent.dal.js";


function assertDailyLimitMinutes(value) {
  const n = Number(value);

  if (!Number.isFinite(n) || n < 0) {
    throw new AppError(CommonErrors.VALIDATION_ERROR);
  }

  return n;
}


function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}



function buildCurrentStatus(device) {
  const dailyLimitMinutes = Number(device.screenTime?.dailyLimitMinutes ?? 0);
  const extraMinutesToday = Number(device.screenTime?.extraMinutesToday ?? 0);
  const usedTodayMinutes = Number(device.screenTime?.usedTodayMinutes ?? 0);

  const totalAllowedMinutes = dailyLimitMinutes + extraMinutesToday;
  const remainingMinutes = Math.max(totalAllowedMinutes - usedTodayMinutes, 0);

  return {
    isLimitEnabled: device.screenTime?.isLimitEnabled ?? false,
    dailyLimitMinutes,
    extraMinutesToday,
    usedTodayMinutes,
    remainingMinutes,
    isLocked: device.isLocked ?? false,
    isActive: device.isActive ?? true
  };
}


export async function validateDeviceAccess({ deviceId, parentId, childId, allowInactive = false }) {
  const device = await findDeviceById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.parentId) !== String(parentId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (childId && String(device.childId) !== String(childId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  return device;
}

function ensureChildBelongsToParent(childList, childId) {
  const belongs = childList.some((child) => String(child._id) === String(childId));

  if (!belongs) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }
}



export async function lockDevice(parentId, deviceId) {

  const device = await validateDeviceAccess({ deviceId, parentId });

  const updatedDevice = await updateDeviceById(deviceId, { isLocked: true });

  try {
    await notifyChild({
      parentId,
      childId: device.childId,
      type: NotificationType.DEVICE_LOCKED,
      severity: NotificationSeverity.WARNING,
      title: "Device Locked",
      description: "The parent locked the device"
    });
  } catch (err) {
    console.error("notifyChild failed in lockDevice:", err.message);
  }


  try {
    await sendAuditLog({
      parentId,
      childId: device.childId,
      actionType: AuditActionType.LOCK_DEVICE,
    });
  } catch (err) {
    console.error("sendAuditLog failed in lockDevice:", err.message);
  }


  return updatedDevice;
}


export async function unlockDevice(parentId, deviceId) {

  const device = await validateDeviceAccess({ deviceId, parentId });
  const updatedDevice = await updateDeviceById(deviceId, { isLocked: false });

  try {

    await notifyChild({
      parentId,
      childId: device.childId,
      type: NotificationType.DEVICE_UNLOCKED,
      severity: NotificationSeverity.INFO,
      title: "Device Unlocked",
      description: "The parent unlocked the device"
    });
  } catch (err) {
    console.error("notifyChild failed in unlockDevice:", err.message);
  }

  try {
    await sendAuditLog({
      parentId,
      childId: device.childId,
      actionType: AuditActionType.UNLOCK_DEVICE,
    });
  } catch (err) {
    console.error("sendAuditLog failed in unlockDevice:", err.message);
  }

  return updatedDevice;
}


export async function getDevicesByChild(parentId, childId) {
  const childList = await getChildrenByParentId(parentId);
  ensureChildBelongsToParent(childList, childId);

  return findDevicesByChildId(childId);
}

export async function updateDeviceName(parentId, childId, deviceId, name) {
  const device = await validateDeviceAccess({ deviceId, parentId, childId });
  if (device != null && device.name === name) {
    return device;
  }

  const previousName =
    device?.name != null && String(device.name).trim() !== ""
      ? String(device.name).trim()
      : "";
  const newName = String(name ?? "").trim();

  const updated = await updateDeviceById(deviceId, { name: newName });

  try {
    await notifyParent({
      parentId,
      childId,
      type: NotificationType.DEVICE_RENAMED,
      severity: NotificationSeverity.INFO,
      title: "Device Renamed",
      description: previousName
        ? `"${previousName}" was renamed to "${newName}"`
        : `A device was renamed to "${newName}"`
    });
  } catch (err) {
    console.error("notifyParent failed in updateDeviceName:", err.message);
  }

  return updated;
}


// Return current screen-time settings for a specific device
export async function getDeviceScreenTime(parentId, deviceId) {

  let device = await validateDeviceAccess({ deviceId, parentId });

  const now = new Date();

  const lastReset = device.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  if (!lastReset || !isSameDay(lastReset, now)) {
    device = await resetDailyScreenTime(deviceId, now);
  }

  return device.screenTime;
}

// Update screen-time settings for a specific device
export async function updateDeviceScreenTime(parentId, deviceId, body) {

  const device = await validateDeviceAccess({ deviceId, parentId });

  const currentScreenTime = device.screenTime || {};

  const patch = {
    screenTime: {
      ...currentScreenTime, // keep existing values
      ...body               // override only fields sent by the client
    }
  };

  const updatedDevice = await updateDeviceById(deviceId, patch);

  try {
    await notifyChild({
      parentId,
      childId: device.childId,
      type: NotificationType.SCREEN_TIME_UPDATED,
      severity: NotificationSeverity.INFO,
      title: "Screen Time Limits Updated",
      description: "The parent updated the screen time settings"
    });
  } catch (err) {
    console.error("notifyChild failed in updateDeviceScreenTime:", err.message);
  }

  try {
    await notifyParent({
      parentId,
      childId: device.childId,
      type: NotificationType.SCREEN_TIME_UPDATED,
      severity: NotificationSeverity.INFO,
      title: "Screen Time Updated",
      description: "You updated the screen time settings for your child"
    });
  } catch (err) {
    console.error("notifyParent failed in updateDeviceScreenTime:", err.message);
  }
  
  try {
    await sendAuditLog({
      parentId,
      childId: device.childId,
      actionType: AuditActionType.UPDATE_SCREEN_TIME,
    });
  } catch (err) {
    console.error("sendAuditLog failed in updateDeviceScreenTime:", err.message);
  }

  return updatedDevice;
}


export async function setDeviceActive(parentId, deviceId, isActive) {
  if (typeof isActive !== "boolean") {
    throw new AppError(CommonErrors.VALIDATION_IS_ACTIVE);
  }

  await validateDeviceAccess({ deviceId, parentId, allowInactive: true });

  const updatedDevice = await updateDeviceById(deviceId, { isActive });

  return updatedDevice;
}


export async function getDevicePolicy({ deviceId, childId, parentId }) {
  let device = await findDeviceById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.childId) !== String(childId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (parentId && String(device.parentId) !== String(parentId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (device.isActive === false) {
    throw new AppError(CommonErrors.DEVICE_NOT_ACTIVE);
  }

  const now = new Date();

  const lastReset = device.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  if (!lastReset || !isSameDay(lastReset, now)) {
    device = await resetDailyScreenTime(deviceId, now);
  }

  return {
    deviceId: String(device._id),
    childId: String(device.childId),
    parentId: String(device.parentId),
    platform: device.platform,
    isLocked: device.isLocked,
    isActive: device.isActive,
    screenTime: {
      isLimitEnabled: device.screenTime?.isLimitEnabled ?? false,
      dailyLimitMinutes: device.screenTime?.dailyLimitMinutes ?? 0,
      extraMinutesToday: device.screenTime?.extraMinutesToday ?? 0,
      weeklyLimitMinutes: device.screenTime?.weeklyLimitMinutes ?? 0,
      usedTodayMinutes: device.screenTime?.usedTodayMinutes ?? 0,
      usedWeekMinutes: device.screenTime?.usedWeekMinutes ?? 0,
      lastDailyResetAt: device.screenTime?.lastDailyResetAt ?? null,
      lastWeeklyResetAt: device.screenTime?.lastWeeklyResetAt ?? null,
      weeklySchedule: device.screenTime?.weeklySchedule ?? []
    },
    updatedAt: device.updatedAt
  };
}

export async function getDeviceByChild(parentId, childId, deviceId) {
  const childList = await getChildrenByParentId(parentId);
  ensureChildBelongsToParent(childList, childId);

  const device = await validateDeviceAccess({ deviceId, parentId, childId });

  return device;
}

// Delete a device that belongs to the given child : parent must own that child
export async function deleteDeviceForParent(parentId, childId, deviceId) {
  const childList = await getChildrenByParentId(parentId);
  ensureChildBelongsToParent(childList, childId);
  const device = await validateDeviceAccess({ deviceId, parentId, childId });
  const deviceLabel =
    device?.deviceName != null && String(device.deviceName).trim() !== ""
      ? String(device.deviceName).trim()
      : "A device";

  await deleteDeviceById(deviceId);

  try {
    await notifyParent({
      parentId,
      childId,
      type: NotificationType.DEVICE_DELETED,
      severity: NotificationSeverity.WARNING,
      title: "Device Removed",
      description: `${deviceLabel} was removed from this child profile`
    });
  } catch (err) {
    console.error("notifyParent failed in deleteDeviceForParent:", err.message);
  }
}



export async function blockApplication(parentId, deviceId, packageName) {
  const device = await validateDeviceAccess({ deviceId, parentId });

  const app = device.applications?.find(
    (application) => application.packageName === packageName
  );

  if (!app) {
    throw new AppError(CommonErrors.APP_NOT_FOUND);
  }

  const updatedDevice = await updateApplicationBlockStatus(deviceId, packageName, true);

  const updatedApp = updatedDevice.applications?.find(
    (application) => application.packageName === packageName
  );

  return updatedApp;
}


export async function unblockApplication(parentId, deviceId, packageName) {
  const device = await validateDeviceAccess({ deviceId, parentId });

  const app = device.applications?.find(
    (application) => application.packageName === packageName
  );

  if (!app) {
    throw new AppError(CommonErrors.APP_NOT_FOUND);
  }

  const updatedDevice = await updateApplicationBlockStatus(deviceId, packageName, false);

  const updatedApp = updatedDevice.applications?.find(
    (application) => application.packageName === packageName
  );

  return updatedApp;
}






export async function getDeviceDailyLimit(parentId, deviceId) {
  await validateDeviceAccess({ deviceId, parentId });

  let device = await findDeviceDailyLimitById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  const now = new Date();

  const lastReset = device.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  if (!lastReset || !isSameDay(lastReset, now)) {
    device = await resetDailyScreenTime(deviceId, now);
  }

  return {
    isLimitEnabled: device.screenTime?.isLimitEnabled ?? false,
    dailyLimitMinutes: device.screenTime?.dailyLimitMinutes ?? 0,
    extraMinutesToday: device.screenTime?.extraMinutesToday ?? 0,
    usedTodayMinutes: device.screenTime?.usedTodayMinutes ?? 0
  };
}




export async function updateDeviceDailyLimitService(parentId, deviceId, body) {
  const device = await validateDeviceAccess({ deviceId, parentId });

  const isLimitEnabled =
    typeof body.isLimitEnabled === "boolean"
      ? body.isLimitEnabled
      : device.screenTime?.isLimitEnabled ?? false;

  const dailyLimitMinutes =
    body.dailyLimitMinutes !== undefined
      ? assertDailyLimitMinutes(body.dailyLimitMinutes)
      : device.screenTime?.dailyLimitMinutes ?? 0;

  const updatedDevice = await updateDeviceDailyLimit(deviceId, {
    isLimitEnabled,
    dailyLimitMinutes
  });

  try {
    await notifyChild({
      parentId,
      childId: device.childId,
      type: NotificationType.SCREEN_TIME_UPDATED,
      severity: NotificationSeverity.INFO,
      title: "Daily Screen Time Updated",
      description: "The parent updated the daily screen time limit"
    });
  } catch (err) {
    console.error("notifyChild failed in updateDeviceDailyLimitService:", err.message);
  }

  try {
    await sendAuditLog({
      parentId,
      childId: device.childId,
      actionType: AuditActionType.UPDATE_SCREEN_TIME,
    });
  } catch (err) {
    console.error("sendAuditLog failed in updateDeviceDailyLimitService:", err.message);
  }

  return {
    isLimitEnabled: updatedDevice.screenTime?.isLimitEnabled ?? false,
    dailyLimitMinutes: updatedDevice.screenTime?.dailyLimitMinutes ?? 0,
    extraMinutesToday: updatedDevice.screenTime?.extraMinutesToday ?? 0,
    usedTodayMinutes: updatedDevice.screenTime?.usedTodayMinutes ?? 0
  };
}


export async function getDeviceCurrentStatusForChild({ deviceId, childId, parentId }) {
  let device = await findDeviceStatusById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.childId) !== String(childId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (parentId && String(device.parentId) !== String(parentId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (device.isActive === false) {
    throw new AppError(CommonErrors.DEVICE_NOT_ACTIVE);
  }

  const now = new Date();

  const lastReset = device.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  if (!lastReset || !isSameDay(lastReset, now)) {
    device = await resetDailyScreenTime(deviceId, now);
  }

  return buildCurrentStatus(device);
}


export async function updateDeviceLocation(deviceId, location, parentId, childId) {
  await validateDeviceAccess({ deviceId, parentId, childId });

  const fieldsToUpdate = {
    location: {
      lat: location.lat,
      lng: location.lng,
      lastUpdated: new Date()
    }
  };

  const updatedDevice = await updateDeviceById(deviceId, fieldsToUpdate);

  try {
    await notifyParent({
      parentId,
      childId,
      type: NotificationType.CHILD_LOCATION_UPDATED,
      severity: NotificationSeverity.INFO,
      title: "Location Updated",
      description: "Your child's location was updated"
    });
  } catch (err) {
    console.error("notifyParent failed in updateDeviceLocation:", err.message);
  }

  return updatedDevice;

}

export async function updateDeviceUsageByChild({
  deviceId,
  childId,
  parentId,
  usedTodayMinutes
}) {
  const n = Number(usedTodayMinutes);

  if (!Number.isFinite(n) || n < 0) {
    throw new AppError(CommonErrors.VALIDATION_ERROR);
  }

  let device = await findDeviceStatusById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.childId) !== String(childId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (parentId && String(device.parentId) !== String(parentId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (device.isActive === false) {
    throw new AppError(CommonErrors.DEVICE_NOT_ACTIVE);
  }

  const now = new Date();

  const lastReset = device.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  if (!lastReset || !isSameDay(lastReset, now)) {
    device = await resetDailyScreenTime(deviceId, now);
  }

  const previousStatus = buildCurrentStatus(device);
  const updatedDevice = await updateDeviceUsedTodayMinutes(deviceId, n);
  const currentStatus = buildCurrentStatus(updatedDevice);

  const crossedEndingThreshold =
    currentStatus.isLimitEnabled &&
    previousStatus.remainingMinutes > 5 &&
    currentStatus.remainingMinutes <= 5 &&
    currentStatus.remainingMinutes > 0;

  const crossedEndedThreshold =
    currentStatus.isLimitEnabled &&
    previousStatus.remainingMinutes > 0 &&
    currentStatus.remainingMinutes <= 0 &&
    !updatedDevice.isLocked;

  if (crossedEndingThreshold) {
    try {
      await notifyParent({
        parentId: updatedDevice.parentId,
        childId: updatedDevice.childId,
        type: NotificationType.SCREEN_TIME_ENDING,
        severity: NotificationSeverity.WARNING,
        title: "Screen Time Almost Over",
        description: `Your child has ${currentStatus.remainingMinutes} minute${currentStatus.remainingMinutes === 1 ? "" : "s"} left`
      });
    } catch (err) {
      console.error("notifyParent failed in updateDeviceUsageByChild (ending):", err.message);
    }
  }

  if (crossedEndedThreshold) {
    const lockedDevice = await updateDeviceById(deviceId, { isLocked: true });

    try {
      await notifyParent({
        parentId: lockedDevice.parentId,
        childId: lockedDevice.childId,
        type: NotificationType.SCREEN_TIME_ENDED,
        severity: NotificationSeverity.CRITICAL,
        title: "Screen Time Ended",
        description: "Your child has reached the daily screen time limit"
      });
    } catch (err) {
      console.error("notifyParent failed in updateDeviceUsageByChild (ended):", err.message);
    }

    try {
      await notifyChild({
        parentId: lockedDevice.parentId,
        childId: lockedDevice.childId,
        type: NotificationType.SCREEN_TIME_ENDED,
        severity: NotificationSeverity.WARNING,
        title: "Time's Up",
        description: "You have reached your daily screen time limit"
      });
    } catch (err) {
      console.error("notifyChild failed in updateDeviceUsageByChild (ended):", err.message);
    }

    try {
      await sendAuditLog({
        parentId: lockedDevice.parentId,
        childId: lockedDevice.childId,
        actionType: AuditActionType.LOCK_DEVICE,
      });
    } catch (err) {
      console.error("sendAuditLog failed in updateDeviceUsageByChild (ended):", err.message);
    }

    return buildCurrentStatus(lockedDevice);
  }

  return currentStatus;
}


export async function handleDeviceHeartbeat({
  deviceId,
  childId,
  parentId,
  accessibilityEnabled,
  usageAccessEnabled
}) {
  if (typeof accessibilityEnabled !== "boolean" || typeof usageAccessEnabled !== "boolean") {
    throw new AppError(CommonErrors.VALIDATION_ERROR);
  }

  const device = await findDeviceById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.childId) !== String(childId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (parentId && String(device.parentId) !== String(parentId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (device.isActive === false) {
    throw new AppError(CommonErrors.DEVICE_NOT_ACTIVE);
  }

  const wasAccessibilityEnabled = device.accessibilityEnabled ?? true;
  const wasUsageAccessEnabled = device.usageAccessEnabled ?? true;

  const updatedDevice = await updateDeviceHeartbeat(deviceId, {
    lastSeenAt: new Date(),
    accessibilityEnabled,
    usageAccessEnabled
  });



  if (wasAccessibilityEnabled && !accessibilityEnabled) {
    try {
      await notifyParent({
        parentId: device.parentId,
        childId: device.childId,
        type: NotificationType.BYPASS_ATTEMPT,
        severity: NotificationSeverity.CRITICAL,
        title: "Protection Disabled",
        description: "Accessibility service was turned off"
      });
    } catch (err) {
      console.error("notifyParent failed in handleDeviceHeartbeat (accessibility):", err.message);
    }
  }

  if (wasUsageAccessEnabled && !usageAccessEnabled) {
    try {
      await notifyParent({
        parentId: device.parentId,
        childId: device.childId,
        type: NotificationType.BYPASS_ATTEMPT,
        severity: NotificationSeverity.WARNING,
        title: "Limited Protection",
        description: "Usage access permission was turned off"
      });
    } catch (err) {
      console.error("notifyParent failed in handleDeviceHeartbeat (usage):", err.message);
    }
  }

  return {
    deviceId: String(updatedDevice._id),
    lastSeenAt: updatedDevice.lastSeenAt,
    accessibilityEnabled: updatedDevice.accessibilityEnabled,
    usageAccessEnabled: updatedDevice.usageAccessEnabled
  };
}