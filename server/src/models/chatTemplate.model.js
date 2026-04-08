import mongoose from "mongoose";
import { TargetRole } from "../constants/role.js";


export const ChatTemplateSchema = new mongoose.Schema({
    isMenu: { type: Boolean, default: false },
    menuOptionNumber: { type: Number },
    content: { type: String, required: true },
    category: { type: String },
    TargetRole: {
      type: String,
      enum: Object.values(TargetRole),
      required: true,
      default: TargetRole.BOTH,
    },
  }, { timestamps: true });
export default mongoose.model("ChatTemplate", ChatTemplateSchema);