import mongoose from "mongoose";

export const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true},
        childId: { type: mongoose.Schema.Types.ObjectId, required: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        description: { type: String, default: "" },
        coinsReward: { type: Number, required: true, default: 0 },
        icon: { type: String, default: "default.png" },
        proofImg: { type: String, default: "default.png" },
        points: { type: Number, required: true, default: 0 },
        completedAt: { type: Date, default: null },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
        isActive: { type: Boolean, default: true },
        isApproved: { type: Boolean, default: false },
        isRegulary: { type: Boolean, default: false },
        isTemporary: { type: Boolean, default: false },
    }, { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);