import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { assertValidObjectId } from "../utils/validators.js";
import * as auditDal from "../dal/audit.dal.js";
import { getChildrenByParentId } from "../dal/parent.dal.js";

function ensureChildBelongsToParent(childList, childId) {
  const child = childList.find((c) => String(c._id) === String(childId));

  if (!child) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  return child;
}

export async function sendAuditLog({ parentId, childId = null, actionType }) {
  try {
    await auditDal.createAuditLogDoc({
      parentId,
      childId,
      actionType,
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}

export async function getParentAuditLogs({ parentId, childId }) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);

  if (childId) {
    assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);

    const childList = await getChildrenByParentId(parentId);
    ensureChildBelongsToParent(childList, childId);
  }

  return auditDal.findAuditLogsByParent({
    parentId,
    childId
  });
}