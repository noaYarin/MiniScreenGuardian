import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { generatePairingController, linkPairingController } from "../controllers/pairing.controller.js";

const router = Router();

// POST /api/v1/pairing/generate-code
// Parent: create pairing session (4-digit code + barcode token)
router.post("/generate-code", authJwt, requireParent, generatePairingController);

// POST /api/v1/pairing/link-device
// Child: link device using code or scanned barcodeToken.
router.post("/link-device", linkPairingController);

export default router;
