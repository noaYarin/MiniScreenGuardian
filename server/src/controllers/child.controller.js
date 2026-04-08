import {
  addChild,
  getChildren,
  setChildActive,
  updateChildInterests,
  getChild,
  deleteChild
} from "../services/parent.service.js";
import { updateCurrentChildProfile, updateChildProfileImageByParent } from "../services/child.service.js";

export async function addChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const data = await addChild(parentId, req.body);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getChildrenController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const includeInactive = req.query?.includeInactive === "true";
    const data = await getChildren(parentId, { includeInactive });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function getChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;

    const data = await getChild(parentId, childId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function setChildActiveController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;
    const { isActive } = req.body;

    const data = await setChildActive(parentId, childId, isActive);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function getCurrentChildProfileController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const childId = req.user.childId;
    const data = await getChild(parentId, childId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateChildInterestsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const childId = req.user.childId;
    const { interests } = req.body;

    const data = await updateChildInterests(parentId, childId, interests);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function updateCurrentChildProfileController(req, res, next) {
  try {
      const parentId = req.user.parentId;
      const { childId } = req.params;
    const { birthDate, gender } = req.body;

    const data = await updateCurrentChildProfile(parentId, childId, birthDate, gender);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateChildProfileImageController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;
    const { img } = req.body;

    const data = await updateChildProfileImageByParent(parentId, childId, img);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;

    const data = await deleteChild(parentId, childId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}