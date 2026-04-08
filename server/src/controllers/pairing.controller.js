import { generatePairing, linkByCodeOrToken } from "../services/pairing.service.js";

//Generate pairing code and barcode token for parent to link device
export async function generatePairingController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const childId = req.body?.childId ?? null;
    const data = await generatePairing(parentId, childId);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function linkPairingController(req, res, next) {
  try {
    const { code, barcodeToken, deviceName, deviceType, platform, deviceId} = req.body ?? {};
    const data = await linkByCodeOrToken({ code, barcodeToken, deviceName, deviceType, platform, deviceId});
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}
