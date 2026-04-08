import { getParentHomeSummary } from "../services/parent.service.js";

export async function getParentHomeSummaryController(req, res, next) {
  try {
    const parentId = req.user.parentId;

    const data = await getParentHomeSummary(parentId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}