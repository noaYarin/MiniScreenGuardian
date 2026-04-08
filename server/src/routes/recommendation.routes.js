import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { requireChild } from "../middlewares/requireChild.js";
import {
  getParentRecommendationsController,
  getChildInterestRecommendationsController
} from "../controllers/recommendation.controller.js";

const router = Router();

// GET /api/v1/recommendations/parent/:childId
router.get("/parent/:childId", authJwt, requireParent, getParentRecommendationsController);


// GET /api/v1/recommendations/child/interests
router.get("/child/interests", authJwt, requireChild, getChildInterestRecommendationsController);

export default router;