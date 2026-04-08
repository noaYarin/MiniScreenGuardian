import AuditLogModel from "../models/auditLog.model.js";

export async function createAuditLogDoc(data) {
  return AuditLogModel.create(data);
}

export async function findAuditLogsByParent({ parentId, childId }) {
  const filter = { parentId };

  if (childId) {
    filter.childId = childId;
  }

  return AuditLogModel.find(filter)
    .sort({ createdAt: -1 })
    .lean();
}