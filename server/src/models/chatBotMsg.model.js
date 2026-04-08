import mongoose from "mongoose";
import { SenderRole } from "../constants/role.js";

export const ChatBotMsgSchema = new mongoose.Schema({

    parentId: { type: mongoose.Schema.Types.ObjectId,ref: "Parent", required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatTemplate", required: true },
     senderRole: {
      type: String,
      enum: Object.values(SenderRole),
      required: true,
    },
  }, { timestamps: true });

  export default mongoose.model("ChatBotMsg", ChatBotMsgSchema);