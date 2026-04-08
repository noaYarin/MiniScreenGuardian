import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireChild } from "../middlewares/requireChild.js";
import { requireParent } from "../middlewares/requireParent.js";
import {
  getCurrentChildProfileController,
  updateChildInterestsController,
  updateCurrentChildProfileController,
  updateChildProfileImageController,
} from "../controllers/child.controller.js";

const router = Router();

// GET /api/v1/child/profile
router.get("/profile", authJwt, requireChild, getCurrentChildProfileController);

// PATCH /api/v1/child/me/interests
// Update child interests (self)
router.patch("/interests", authJwt, requireChild, updateChildInterestsController);

// PUT /api/v1/child/profile
router.put("/:childId/profile", authJwt, requireParent, updateCurrentChildProfileController);

router.put("/:childId/profile-image", authJwt, requireParent, updateChildProfileImageController);

export default router;