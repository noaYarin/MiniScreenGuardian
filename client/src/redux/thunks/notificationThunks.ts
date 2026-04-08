import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetParentNotifications,
  apiMarkAllParentNotificationsRead,
  apiMarkParentNotificationRead,
  apiDeleteParentNotification,
  type Notification
} from "@/src/api/notification";

function normalizeNotification(raw: unknown): Notification {
  if (raw == null || typeof raw !== "object") {
    throw new Error("notifications.fetch_failed");
  }
  const n = raw as Record<string, unknown>;
  const id = n._id ?? n.id;
  if (id == null) throw new Error("notifications.fetch_failed");
  return {
    _id: String(id),
    parentId: n.parentId != null ? String(n.parentId) : "",
    childId: n.childId != null ? String(n.childId) : null,
    targetRole: (n.targetRole === "CHILD" ? "CHILD" : "PARENT") as Notification["targetRole"],
    type: n.type != null ? String(n.type) : "",
    severity: n.severity != null ? String(n.severity) : "INFO",
    title: n.title != null ? String(n.title) : "",
    description: n.description != null ? String(n.description) : "",
    isRead: Boolean(n.isRead),
    createdAt: n.createdAt != null ? String(n.createdAt) : undefined,
  };
}

function normalizePagination(
  raw: unknown,
  fallback: { page: number; limit: number }
) {
  const p = raw != null && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    total: Math.max(0, Number(p.total) || 0),
    page: Math.max(1, Number(p.page) || fallback.page),
    pages: Math.max(1, Number(p.pages) || 1),
    limit: Math.max(1, Number(p.limit) || fallback.limit),
  };
}

export const fetchParentNotificationsThunk = createAsyncThunk(
  "notifications/fetchAll",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await apiGetParentNotifications(page, limit);
      const unreadCount = response?.unreadCount??0;
      const rawList = Array.isArray(response?.notifications) ? response.notifications : [];
      const data = rawList
        .map((row) => {
          try {
            return normalizeNotification(row);
          } catch {
            return null;
          }
        })
        .filter((n): n is Notification => n != null);

      const pagination = normalizePagination(response?.pagination, { page, limit });

      return { data, pagination, unreadCount };
    } catch (error: unknown) {
      const message =
        error instanceof Error && typeof error.message === "string"
          ? error.message
          : "Failed to fetch notifications";
      return rejectWithValue(message);
    }
  }
);
export const markParentNotificationReadThunk = createAsyncThunk<
  Notification,
  { notificationId: string },
  { rejectValue: string }
>("notifications/markRead", async ({ notificationId }, thunkAPI) => {
  try {
    const updated = await apiMarkParentNotificationRead(notificationId);
    return normalizeNotification(updated);
  } catch (error) {
    const message = (error as Error)?.message ?? "notifications.mark_read_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const markAllParentNotificationsReadThunk = createAsyncThunk<
  { success: boolean },
  void,
  { rejectValue: string }
>("notifications/markAllRead", async (_, thunkAPI) => {
  try {
    return await apiMarkAllParentNotificationsRead();
  } catch (error) {
    const message = (error as Error)?.message ?? "notifications.mark_all_read_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteParentNotificationThunk = createAsyncThunk<
  { notificationId: string },
  { notificationId: string },
  { rejectValue: string }
>("notifications/delete", async ({ notificationId }, thunkAPI) => {
  try {
    await apiDeleteParentNotification(notificationId);
    return { notificationId };
  } catch (error) {
    const message =
      (error as Error)?.message ?? "notifications.delete_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

