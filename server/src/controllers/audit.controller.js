import * as auditService from "../services/audit.service.js";

export async function getParentAuditLogsController(req, res, next) {
  try {
    const list = await auditService.getParentAuditLogs({
      parentId: req.user.parentId,
      childId: req.query.childId
    });

    return res.json({ ok: true, data: list });
  } catch (err) {
    next(err);
  }
}