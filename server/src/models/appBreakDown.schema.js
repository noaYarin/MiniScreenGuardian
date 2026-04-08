import mongoose from "mongoose";

export const AppBreakdownItemSchema = new mongoose.Schema({
  packageName: { type: String, required: true },
  name: { type: String, default: "" },
  category: { type: String, default: "" },
  usedMinutes: { type: Number, default: 0 },
}, { _id: false });
