import {
  createNotification,
  findNotificationsWithPagination,
  markNotificationAsReadById,
  markAllNotificationsAsRead,
  deleteNotificationByIdForParent,
} from "../dal/notification.dal.js";
import { TargetRole } from "../constants/role.js";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { getIO } from "../socketHandler.js";
import { NOTIFICATION_CREATED } from "../constants/socketEvents.js";

export async function notifyParent({
    parentId,
    childId,
    type,
    severity,
    title,
    description
}) {
    const notification = await createNotification({
        parentId,
        childId,
        targetRole: TargetRole.PARENT,
        type,
        severity,
        title,
        description
    });

    try {
        const io = getIO();
        if (io && parentId) {
            io.to(`parent_${parentId}`).emit(NOTIFICATION_CREATED, notification);
        }
    } catch (err) {
        console.error("socket emit failed in notifyParent:", err.message);
    }

    return notification;
}

export async function notifyChild({
    parentId,
    childId,
    type,
    severity,
    title,
    description
}) {
    const notification = await createNotification({
        parentId,
        childId,
        targetRole: TargetRole.CHILD,
        type,
        severity,
        title,
        description
    });

    try {
        const io = getIO();
        if (io && childId) {
            io.to(`child_${childId}`).emit(NOTIFICATION_CREATED, notification);
        }
    } catch (err) {
        console.error("socket emit failed in notifyChild:", err.message);
    }

    return notification;
}

// Get all notifications for the authenticated parent
export async function getParentNotifications(parentId, page = 1, limit = 10) {
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    const { notifications, total, unreadCount } = await findNotificationsWithPagination(parentId, skip, limit);

    return {
        notifications,
        total,
        pages: Math.ceil(total / limit),
        unreadCount
    };
}

// Mark a notification as read
export async function markNotificationAsRead(parentId, notificationId) {
  return markNotificationAsReadById(parentId, notificationId);
}

export async function readAllNotifications(parentId) {
  await markAllNotificationsAsRead(parentId);

  return { success: true };
}

export async function deleteParentNotification(parentId, notificationId) {
  const deleted = await deleteNotificationByIdForParent(parentId, notificationId);
  if (!deleted) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }
  return { success: true };
}