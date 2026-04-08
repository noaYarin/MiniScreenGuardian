import mongoose from "mongoose";
import { TimeWindowSchema } from "./timeWindow.schema.js";

export const DayScheduleSchema = new mongoose.Schema(
{
  dayOfWeek: { type: Number, required: true },
  isEnabled: { type: Boolean, default: false },

  blockedWindows: {
    type: [TimeWindowSchema],
    default: []
  }
},
{ _id: false }
);