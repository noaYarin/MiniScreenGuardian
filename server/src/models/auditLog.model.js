import mongoose from "mongoose";
import { AuditActionType } from "../constants/auditActionType.js";

const auditLogSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, default: null  },
    actionType: { 
      type: String, 
      required: true,
      enum: Object.values(AuditActionType) 
    },    
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);