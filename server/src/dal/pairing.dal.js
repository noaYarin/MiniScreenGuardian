import mongoose from "mongoose";
import PairingSessionModel from "../models/pairingSession.model.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { assertValidObjectId } from "../utils/validators.js";

export async function createPairingSession(doc) {
  return PairingSessionModel.create(doc);
}

export async function findByCode(code) {
  return PairingSessionModel.findOne({ code, usedAt: null }).lean();
}

export async function findByBarcodeToken(barcodeToken) {
  return PairingSessionModel.findOne({ barcodeToken, usedAt: null }).lean();
}

export async function consumePairingSession(sessionId) {
  assertValidObjectId(sessionId, CommonErrors.INVALID_SESSION_ID);

  const now = new Date();

  /** if usedAt is not null, the session is already used
   if expiresAt is less than now, the session is expired **/
  const updated = await PairingSessionModel.findOneAndUpdate(
    {
      _id: sessionId,
      usedAt: null,
      expiresAt: { $gt: now },
    },
    { $set: { usedAt: now } },
    { new: true }
  ).lean();

  return updated;
}