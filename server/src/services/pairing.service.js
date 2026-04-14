import crypto from "crypto";
import { AppError } from "../utils/appError.js";
import { Pairing as PairingErrors } from "../constants/errors.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { DevicePlatform } from "../constants/devicePlatform.js";
import { DeviceType } from "../constants/deviceType.js";

import {
  createPairingSession,
  findByCode,
  findByBarcodeToken,
  consumePairingSession,
} from "../dal/pairing.dal.js";
import { getChildByParentId, getChildrenByParentId } from "../dal/parent.dal.js";
import { issueChildToken } from "./auth.service.js";
import { createDevice, findDeviceByDeviceId, updateDeviceActivation, findDevicesByChildId } from "../dal/device.dal.js";
import { notifyParent } from "./notification.service.js";
import { NotificationType } from "../constants/notificationType.js";
import { NotificationSeverity } from "../constants/severity.js";
import { formatJerusalemOffsetIsoNow } from "../utils/time.js";
import { sendAuditLog } from "./audit.service.js";
import { AuditActionType } from "../constants/auditActionType.js";

const MAX_DEVICES_PER_CHILD = 8;

const PAIRING_TTL_MINUTES = 5;
const SHORT_CODE_MAX_ATTEMPTS = 20;
const MS_PER_MINUTE = 60 * 1000;

function generateCode() {
  return String(crypto.randomInt(1000, 10000));
}

function generateBarcodeToken() {
  return crypto.randomUUID();
}


async function createUniqueCode() {
  for (let attempt = 0; attempt < SHORT_CODE_MAX_ATTEMPTS; attempt++) {
    const code = generateCode();
    const existing = await findByCode(code);
    if (!existing) return code;
  }
  throw new AppError(PairingErrors.SHORT_CODE_COLLISION);
}

function assertChildBelongsToParent(childList, childId) {
  const child = childList.find((c) => String(c._id) === String(childId));
  if (!child) throw new AppError(CommonErrors.CHILD_NOT_FOUND);

  if (child.isActive === false) {
    throw new AppError(PairingErrors.CHILD_NOT_ACTIVE);
  }
}

export async function generatePairing(parentId, childIdFromBody) {
  const parentIdStr = String(parentId);

  if (!childIdFromBody) {
    throw new AppError(PairingErrors.CHILD_SELECTION_REQUIRED);
  }

  // Check if the child belongs to the parent and is active
  const childList = await getChildrenByParentId(parentIdStr);
  assertChildBelongsToParent(childList, childIdFromBody);

  const code = await createUniqueCode();
  const barcodeToken = generateBarcodeToken();
  const expiresAt = new Date(Date.now() + PAIRING_TTL_MINUTES * MS_PER_MINUTE);

  await createPairingSession({
    code,
    barcodeToken,
    parentId: parentIdStr,
    childId: String(childIdFromBody),
    expiresAt,
  });

  return {
    code,
    barcodeToken,
    expiresAt: expiresAt.toISOString(),
  };
}

function validateLinkPayload(payload) {
  const { code, barcodeToken } = payload;
  const hasCode = code != null && String(code).trim() !== "";
  const hasBarcode = barcodeToken != null && String(barcodeToken).trim() !== "";

  if (!hasCode && !hasBarcode) throw new AppError(PairingErrors.LINK_NEED_ONE);
  if (hasCode && hasBarcode) throw new AppError(PairingErrors.LINK_ONLY_ONE);

  return hasCode
    ? { byCode: true, value: String(code).trim() }
    : { byCode: false, value: String(barcodeToken).trim() };
}

// Link device to child using code or barcode token
export async function linkByCodeOrToken({ code = "", barcodeToken = "", deviceName = "", deviceType = "OTHER", platform = "OTHER", deviceId = "" }) {
  console.log("linkByCodeOrToken", { code, barcodeToken, deviceName, deviceType, platform, deviceId });
  const { byCode, value } = validateLinkPayload({ code, barcodeToken });
  const session = byCode ? await findByCode(value) : await findByBarcodeToken(value);

  if (!session) {
    throw new AppError(PairingErrors.SESSION_NOT_FOUND);
  }

  const sessionCode = session.code;
  const sessionBarcode = session.barcodeToken;
  // Check if session is already used or expired
  const consumed = await consumePairingSession(session._id);
  if (!consumed) {
    throw new AppError(PairingErrors.SESSION_INVALID);
  }

  const parentId = String(consumed.parentId);
  const childId = String(consumed.childId);
  if (!childId) throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  if (!parentId) throw new AppError(CommonErrors.PARENT_NOT_FOUND);
  const child = await getChildByParentId(parentId, childId);
  const childName = child?.name != null ? String(child.name) : "";

  let currentDevice = await findDeviceByDeviceId(deviceId);

  if (currentDevice) {
    if (currentDevice.isActive) {
      throw new AppError(PairingErrors.DEVICE_ALREADY_LINKED);
    }

    await updateDeviceActivation(deviceId, { childId, parentId, deviceName });

    currentDevice = await findDeviceByDeviceId(deviceId);

  } else {
    const devices = await findDevicesByChildId(childId);
    const activeDevices = devices.filter(d => d.isActive);

    if (activeDevices.length >= MAX_DEVICES_PER_CHILD) {
      throw new AppError(CommonErrors.LIMIT_MAX_DEVICES_REACHED);
    }

    currentDevice = await createDevice({
      deviceId,
      name: deviceName,
      type: deviceType,
      platform,
      isLocked: false,
      code: sessionCode || "",
      location: { lat: 0, lng: 0, lastUpdated: formatJerusalemOffsetIsoNow() },
      isActive: true,
      barcodeToken: sessionBarcode || "",
      applications: [],
      parentId: String(session.parentId),
      childId: String(session.childId),
      screenTime: {},
    });
  }

  const mongoDeviceId = currentDevice?._id ? String(currentDevice._id) : String(deviceId);
  // Issue a token for the child to access the app with scan the QR
  const tokenData = await issueChildToken(parentId, childId, mongoDeviceId);

  const displayDeviceName = deviceName != null && String(deviceName).trim() !== "" ? String(deviceName).trim() : "New device";

  try {
    await notifyParent({
      parentId,
      childId,
      type: NotificationType.DEVICE_ADDED,
      severity: NotificationSeverity.INFO,
      title: "Device Added",
      description: `${displayDeviceName} was linked${childName ? ` to ${childName}` : ""}`
    });
  } catch (err) {
    console.error("notifyParent failed in linkByCodeOrToken:", err.message);
  }

  try {
    await sendAuditLog({
      parentId,
      childId,
      actionType: AuditActionType.DEVICE_ADDED,
    });
  } catch (err) {
    console.error("sendAuditLog failed in linkByCodeOrToken:", err.message);
  }
  
  return {
    ...tokenData,
    deviceId: mongoDeviceId,
    physicalId: String(deviceId),
    childName,
  };
}
