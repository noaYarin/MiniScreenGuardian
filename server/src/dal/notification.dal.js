import NotificationModel from "../models/notification.model.js";
import { assertValidObjectId } from "../utils/validators.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { TargetRole } from "../constants/role.js";


// Create a new notification
export async function createNotification(doc) {
  return NotificationModel.create(doc);
}

// Return all notifications that belong to a specific parent
  export async function findNotificationsWithPagination(parentId, skip, limit) {
    assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
    const [notifications, total, unreadCount] = await Promise.all([
      NotificationModel.find({ parentId, targetRole: "PARENT" })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
      NotificationModel.countDocuments({ parentId, targetRole: "PARENT" }),
      NotificationModel.countDocuments({ parentId, targetRole: "PARENT", isRead: false })
  ]);

  return { notifications, total, unreadCount };
  }

// Return a notification by its id
export async function findNotificationById(notificationId) {
  assertValidObjectId(notificationId, CommonErrors.INVALID_ID);

  return NotificationModel.findById(notificationId).lean();
}

// Mark a notification as read
export async function markNotificationAsReadById(parentId, notificationId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
  assertValidObjectId(notificationId, CommonErrors.INVALID_ID);

  return NotificationModel.findOneAndUpdate(
    { _id: notificationId, parentId, targetRole: TargetRole.PARENT },
    { $set: { isRead: true } },
    { new: true }
  ).lean();
}

export async function markAllNotificationsAsRead(parentId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);

  return NotificationModel.updateMany(
    { parentId, targetRole: TargetRole.PARENT, isRead: false },
    { $set: { isRead: true } }
  );
}

export async function deleteNotificationByIdForParent(parentId, notificationId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
  assertValidObjectId(notificationId, CommonErrors.INVALID_ID);

  return NotificationModel.findOneAndDelete({
    _id: notificationId,
    parentId,
    targetRole: TargetRole.PARENT
  }).lean();
}