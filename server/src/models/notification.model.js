import mongoose from "mongoose";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { TargetRole } from "../constants/role.js";

export const NotificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        severity: { type: String, enum: Object.values(NotificationSeverity), required: true },
        type: { type: String, enum: Object.values(NotificationType), required: true },
        targetRole: {
            type: String,
            enum: Object.values(TargetRole),
            required: true
        },
        isRead: { type: Boolean, default: false },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        childId: { type: mongoose.Schema.Types.ObjectId, required: true },
    }, { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);