import mongoose from "mongoose";
import { RequestStatus } from "../constants/status.js";

export const RequestSchema = new mongoose.Schema(
    {
        reason: { type: String, default: "" },
        status: {
            type: String, enum: Object.values(RequestStatus), default: RequestStatus.PENDING,
            required: true
        },
        childId: { type: mongoose.Schema.Types.ObjectId, required: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
        requestedMinutes: { type: Number, required: true, min: 1, max: 120 },
    }, { timestamps: true }
);

// Indexes
RequestSchema.index({ parentId: 1, status: 1 });
RequestSchema.index({ childId: 1 });


export default mongoose.model("Request", RequestSchema);