import mongoose from "mongoose";

export const PrizeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true},
        description: { type: String, default: "" },
        icon: { type: String, default: "default.png" },
        points: { type: Number, required: true, default: 0 },
        isActive: { type: Boolean, default: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        childId: { type: mongoose.Schema.Types.ObjectId, required: true },
    }, { timestamps: true }
);

export default mongoose.model("Prize", PrizeSchema);