import mongoose from "mongoose";

export const TimeWindowSchema = new mongoose.Schema(
{
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
},
{ _id: false }
);