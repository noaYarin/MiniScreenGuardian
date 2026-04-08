import {
  getDevicesByChild,
  lockDevice,
  unlockDevice,
  getDeviceScreenTime,
  updateDeviceScreenTime,
  setDeviceActive,
  getDevicePolicy,
  getDeviceDailyLimit,
  updateDeviceDailyLimitService,
  blockApplication,
  unblockApplication,
  getDeviceByChild,
  getDeviceCurrentStatusForChild,
  updateDeviceUsageByChild,
  deleteDeviceForParent,
  handleDeviceHeartbeat,
  updateDeviceLocation,
  updateDeviceName
} from "../services/device.service.js";

export async function getDevicesByChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;

    const devices = await getDevicesByChild(parentId, childId);

    res.status(200).json({ ok: true, data: devices });
  } catch (err) {
    next(err);
  }
}

export async function updateDeviceNameController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId, deviceId } = req.params;
    const { name } = req.body;
    const data = await updateDeviceName(parentId, childId, deviceId, name);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function lockDeviceController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;
    const data = await lockDevice(parentId, deviceId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function unlockDeviceController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;
    const data = await unlockDevice(parentId, deviceId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

// Return current screen-time settings for a specific device
export async function getDeviceScreenTimeController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;

    const data = await getDeviceScreenTime(parentId, deviceId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

// Update screen-time settings for a specific device
export async function updateDeviceScreenTimeController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;
    const data = await updateDeviceScreenTime(parentId, deviceId, req.body);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }

}


export async function setDeviceActiveController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;
    const { isActive } = req.body;

    const data = await setDeviceActive(parentId, deviceId, isActive);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function getDevicePolicyController(req, res, next) {
  try {
    const { deviceId } = req.params;
    const childId = req.user?.childId;
    const parentId = req.user?.parentId;

    const policy = await getDevicePolicy({ deviceId, childId, parentId });

    res.status(200).json({ ok: true, data: policy });
  } catch (err) {
    next(err);
  }
}


export async function getDeviceByChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId, deviceId } = req.params;

    const device = await getDeviceByChild(parentId, childId, deviceId);

    res.status(200).json({ ok: true, data: device });
  } catch (err) {
    next(err);
  }
}

export async function deleteDeviceForChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId, deviceId } = req.params;
    await deleteDeviceForParent(parentId, childId, deviceId);
    res.status(200).json({ ok: true, data: null });
  } catch (err) {
    next(err);
  }
}



export async function blockApplicationController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId, packageName } = req.params;

    const data = await blockApplication(parentId, deviceId, packageName);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function unblockApplicationController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId, packageName } = req.params;

    const data = await unblockApplication(parentId, deviceId, packageName);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getDeviceDailyLimitController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;

    const data = await getDeviceDailyLimit(parentId, deviceId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateDeviceDailyLimitController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;

    const data = await updateDeviceDailyLimitService(parentId, deviceId, req.body);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getDeviceCurrentStatusForChildController(req, res, next) {
  try {
    const { deviceId } = req.params;
    const childId = req.user.childId;
    const parentId = req.user.parentId;

    const data = await getDeviceCurrentStatusForChild({
      deviceId,
      childId,
      parentId
    });

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function updateDeviceLocationController(req, res, next) {
  try {
    const { deviceId } = req.params;
    const { location } = req.body;
    const parentId = req.user.parentId;
    const childId = req.user.childId;
    const data = await updateDeviceLocation(deviceId, location, parentId, childId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}
export async function updateDeviceUsageByChildController(req, res, next) {
  try {
    const { deviceId } = req.params;
    const childId = req.user.childId;
    const parentId = req.user.parentId;
    const { usedTodayMinutes } = req.body;

    const data = await updateDeviceUsageByChild({
      deviceId,
      childId,
      parentId,
      usedTodayMinutes
    });

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function deviceHeartbeatController(req, res, next) {
  try {
    const { deviceId } = req.params;
    const childId = req.user.childId;
    const parentId = req.user.parentId;

    const { accessibilityEnabled, usageAccessEnabled } = req.body;

    const data = await handleDeviceHeartbeat({
      deviceId,
      childId,
      parentId,
      accessibilityEnabled,
      usageAccessEnabled
    });

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}