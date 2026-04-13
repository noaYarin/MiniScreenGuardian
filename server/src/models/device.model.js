import mongoose from "mongoose";
import { DeviceType } from "../constants/deviceType.js";
import { ApplicationSchema } from "./application.schema.js"
import { ScreenTimeSchema } from "./screenTime.schema.js"
import { DevicePlatform } from "../constants/devicePlatform.js";
import { formatJerusalemOffsetIsoNow } from "../utils/time.js";

export const DeviceSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        name: { type: String, default: "Child Device" },
        type: { type: String, enum: Object.values(DeviceType), default: DeviceType.OTHER },
        platform: { type: String, enum: Object.values(DevicePlatform), default: DevicePlatform.OTHER },
        isLocked: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        code: { type: String, default: "" },
        location: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 },
            lastUpdated: { type: String, default: () => formatJerusalemOffsetIsoNow() },
        },
        barcodeToken: { type: String, default: "" },
        lastSeenAt: { type: Date, default: null },
        accessibilityEnabled: { type: Boolean, default: null },
        usageAccessEnabled: { type: Boolean, default: null },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        childId: { type: mongoose.Schema.Types.ObjectId, required: true },
        applications: { type: [ApplicationSchema], default: [] },
        screenTime: {
            type: ScreenTimeSchema,
            default: () => ({})
        },
    }, { timestamps: true }
);
export default mongoose.model("Device", DeviceSchema);