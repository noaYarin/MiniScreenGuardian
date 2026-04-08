import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import {
  getParentRecommendations,
  getChildInterestRecommendations
} from "../services/recommendation.service.js";

export async function getChildInterestRecommendationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;
    
    const data = await getChildInterestRecommendations(parentId, childId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getParentRecommendationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;
    const { deviceId } = req.query;

    if (!deviceId) {
      throw new AppError(CommonErrors.INVALID_DEVICE_ID);
    }
    const data = await getParentRecommendations(parentId, childId, deviceId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}