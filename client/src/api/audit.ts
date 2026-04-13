import { api } from "./request";

export type AuditActionType =
  | "LOCK_DEVICE"
  | "UNLOCK_DEVICE"
  | "UPDATE_SCREEN_TIME"
  | "APPROVE_REQUEST"
  | "REJECT_REQUEST"
  | "CHILD_ADDED"
  | "CHILD_DELETED"
  | "CHILD_PROFILE_UPDATED"
  | "DEVICE_RENAMED"
  | "DEVICE_DELETED"
  | "DEVICE_ADDED";

export type AuditLog = {
  _id: string;
  parentId: string;
  childId: string | null;
  actionType: AuditActionType;
  createdAt: string;
  updatedAt: string;
};

export async function apiGetParentAuditLogs(childId?: string): Promise<AuditLog[]> {
  const query = childId ? `?childId=${encodeURIComponent(childId)}` : "";
  return api.get<AuditLog[]>(`/api/v1/audit/parent${query}`, {
    requireAuth: true,
    role: "PARENT",
  });
}