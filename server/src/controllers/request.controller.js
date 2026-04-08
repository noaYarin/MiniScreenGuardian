import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import * as requestService from "../services/request.service.js";

// Child: POST /api/v1/requests/add
export async function createRequestController(req, res, next) {
  try {
    const { deviceId, requestedMinutes, reason } = req.body;

    if (!deviceId) {
      throw new AppError(CommonErrors.INVALID_DEVICE_ID);
    }

    const created = await requestService.createRequest({
      parentId: req.user.parentId,
      childId: req.user.childId,
      deviceId,
      requestedMinutes,
      reason,
    });

    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    next(err);
  }
}

// Child: GET /api/v1/requests/get/child
export async function getMyRequestsController(req, res, next) {
  try {
    const list = await requestService.getChildRequests({
      parentId: req.user.parentId,
      childId: req.user.childId,
      status: req.query.status,
    });

    return res.json({ ok: true, data: list });
  } catch (err) {
    next(err);
  }
}

// Parent: GET /api/v1/requests/get/pending
export async function getPendingRequestsController(req, res, next) {
  try {
    const list = await requestService.getPendingRequests({
      parentId: req.user.parentId,
      childId: req.query.childId, // optional for filtering
    });

    return res.json({ ok: true, data: list });
  } catch (err) {
    next(err);
  }
}

// Parent: PATCH /api/v1/requests/set/:requestId/decision
export async function decideRequestController(req, res, next) {
  try {
    const updated = await requestService.decideRequest({
      parentId: req.user.parentId,
      requestId: req.params.requestId,
      decision: req.body.decision,
    });

    return res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
}