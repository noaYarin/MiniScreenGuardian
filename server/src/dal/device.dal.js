import DeviceModel from "../models/device.model.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { assertValidObjectId } from "../utils/validators.js";

export async function createDevice(doc) {
  return DeviceModel.create(doc);
}

export async function updateDevicesIsActiveByParentId(parentId, isActive) {
  return DeviceModel.updateMany(
    { parentId },
    { $set: { isActive } }
  ).lean();
}

export async function findDeviceByBarcodeOrCode(session) {
  const existingDevice = await DeviceModel.findOne({
    $or: [
      { barcodeToken: session.barcodeToken },
      { code: session.code }
    ]
  }).lean();
  return existingDevice;
}


export async function findDeviceById(deviceId) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findById(deviceId).lean();
}

export async function updateDeviceById(deviceId, patch) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);
  return DeviceModel.findByIdAndUpdate(
    deviceId,
    { $set: patch },
    { new: true }
  ).lean();
}

export async function findDevicesByChildId(childId) {
  assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);
  return DeviceModel.find({ childId }).lean();
}

export async function deleteDeviceById(deviceId) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);
  return DeviceModel.findByIdAndDelete(deviceId).lean();
}

export async function releaseDevicePolicyBeforeDelete(deviceId) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  const device = await DeviceModel.findById(deviceId);
  if (!device) return null;

  device.isLocked = false;

  if (!device.screenTime) {
    device.screenTime = {};
  }

  device.screenTime.isLimitEnabled = false;
  device.screenTime.dailyLimitMinutes = 0;
  device.screenTime.extraMinutesToday = 0;
  device.screenTime.usedTodayMinutes = 0;
  device.screenTime.weeklyLimitMinutes = 0;
  device.screenTime.usedWeekMinutes = 0;
  device.screenTime.weeklySchedule = [];
  device.screenTime.lastDailyResetAt = new Date();
  device.screenTime.lastWeeklyResetAt = new Date();

  if (Array.isArray(device.applications)) {
    device.applications.forEach((app) => {
      app.isBlocked = false;

      if (!app.screenTime) {
        app.screenTime = {};
      }

      app.screenTime.isLimitEnabled = false;
      app.screenTime.dailyLimitMinutes = 0;
      app.screenTime.extraMinutesToday = 0;
      app.screenTime.usedTodayMinutes = 0;
      app.screenTime.weeklyLimitMinutes = 0;
      app.screenTime.usedWeekMinutes = 0;
      app.screenTime.weeklySchedule = [];
      app.screenTime.lastDailyResetAt = new Date();
      app.screenTime.lastWeeklyResetAt = new Date();
    });
  }

  await device.save();
  return device.toObject();
}



export async function addExtraMinutesToDevice(deviceId, minutes) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findByIdAndUpdate(
    deviceId,
    {
      $inc: { "screenTime.extraMinutesToday": minutes }
    },
    { new: true }
  ).lean();
}


export async function resetDailyScreenTime(deviceId, now) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findByIdAndUpdate(
    deviceId,
    {
      $set: {
        isLocked: false,
        "screenTime.usedTodayMinutes": 0,
        "screenTime.extraMinutesToday": 0,
        "screenTime.lastDailyResetAt": now
      }
    },
    { new: true }
  ).lean();
}


export async function updateApplicationBlockStatus(deviceId, packageName, isBlocked) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findOneAndUpdate(
    {
      _id: deviceId,
      "applications.packageName": packageName
    },
    {
      $set: {
        "applications.$.isBlocked": isBlocked
      }
    },
    { new: true }
  ).lean();
}


export async function findDeviceDailyLimitById(deviceId) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findById(
    deviceId,
    {
      "screenTime.isLimitEnabled": 1,
      "screenTime.dailyLimitMinutes": 1,
      "screenTime.extraMinutesToday": 1,
      "screenTime.usedTodayMinutes": 1
    }
  ).lean();
}

export async function updateDeviceDailyLimit(deviceId, { isLimitEnabled, dailyLimitMinutes }) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findByIdAndUpdate(
    deviceId,
    {
      $set: {
        "screenTime.isLimitEnabled": isLimitEnabled,
        "screenTime.dailyLimitMinutes": dailyLimitMinutes
      }
    },
    { new: true }
  ).lean();
}



export async function findDeviceStatusById(deviceId) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findById(
    deviceId,
    {
      parentId: 1,
      childId: 1,
      isLocked: 1,
      isActive: 1,
      "screenTime.isLimitEnabled": 1,
      "screenTime.dailyLimitMinutes": 1,
      "screenTime.extraMinutesToday": 1,
      "screenTime.usedTodayMinutes": 1,
      "screenTime.lastDailyResetAt": 1
    }
  ).lean();
}

export async function updateDeviceUsedTodayMinutes(deviceId, usedTodayMinutes) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findByIdAndUpdate(
    deviceId,
    {
      $set: {
        "screenTime.usedTodayMinutes": usedTodayMinutes
      }
    },
    { new: true }
  ).lean();
}


export async function updateDeviceHeartbeat(
  deviceId,
  { lastSeenAt, accessibilityEnabled, usageAccessEnabled }
) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findByIdAndUpdate(
    deviceId,
    {
      $set: {
        lastSeenAt,
        accessibilityEnabled,
        usageAccessEnabled
      }
    },
    { new: true }
  ).lean();
}


export async function findDeviceByDeviceId(deviceId) {
  return DeviceModel.findOne({ deviceId }).lean();
}

export async function updateDeviceActivation(deviceId, { childId, parentId, deviceName }) {
  return DeviceModel.findOneAndUpdate(
    { deviceId },
    {
      $set: {
        isActive: true,
        childId: String(childId),
        parentId: String(parentId),
        ...(deviceName && { name: deviceName })
      }
    },
    { new: true }
  ).lean();
}