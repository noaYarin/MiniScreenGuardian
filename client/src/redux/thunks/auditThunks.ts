import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetParentAuditLogs,
  type AuditLog,
  type AuditActionType,
} from "../../api/audit";

function normalizeAuditLog(raw: unknown): AuditLog {
  if (raw == null || typeof raw !== "object") {
    throw new Error("activityHistory.fetch_failed");
  }

  const item = raw as Record<string, unknown>;

  const actionType = String(item.actionType ?? "") as AuditActionType;
  const allowedActionTypes: AuditActionType[] = [
    "LOCK_DEVICE",
    "UNLOCK_DEVICE",
    "UPDATE_SCREEN_TIME",
    "APPROVE_REQUEST",
    "REJECT_REQUEST",
    "CHILD_ADDED",
    "CHILD_DELETED",
    "CHILD_PROFILE_UPDATED",
    "DEVICE_RENAMED",
    "DEVICE_DELETED",
    "DEVICE_ADDED",
  ];

  if (!allowedActionTypes.includes(actionType)) {
    throw new Error("activityHistory.fetch_failed");
  }

  return {
    _id: String(item._id ?? item.id ?? ""),
    parentId: String(item.parentId ?? ""),
    childId: item.childId != null ? String(item.childId) : null,
    actionType,
    createdAt:
      typeof item.createdAt === "string"
        ? item.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof item.updatedAt === "string"
        ? item.updatedAt
        : new Date().toISOString(),
  };
}

export const fetchAuditLogsThunk = createAsyncThunk<
  { childId: string; logs: AuditLog[] },
  string,
  { rejectValue: string }
>("audit/fetchLogs", async (childId, thunkAPI) => {
  try {
    const logs = await apiGetParentAuditLogs(
      childId === "all-children-filter" ? undefined : childId
    );

    if (!Array.isArray(logs)) {
      return thunkAPI.rejectWithValue("activityHistory.fetch_failed");
    }

    return {
      childId,
      logs: logs.map(normalizeAuditLog),
    };
  } catch (error) {
    const message =
      (error as Error)?.message ?? "activityHistory.fetch_failed";
    return thunkAPI.rejectWithValue(message);
  }
});