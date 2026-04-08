import mongoose from "mongoose";
import { DayScheduleSchema } from "./daySchedule.schema.js";

export const ScreenTimeSchema = new mongoose.Schema(
    {
        isLimitEnabled: { type: Boolean, default: false },
        dailyLimitMinutes: {
            type: Number,
            default: 0,
            min: 0,
            max: 1440
        },
        extraMinutesToday: { type: Number, default: 0 },
        lastDailyResetAt: { type: Date, default: Date.now },
        weeklyLimitMinutes: {
            type: Number,
            default: 0,
            min: 0,
            max: 10080 
        },
        lastWeeklyResetAt: { type: Date, default: Date.now },
        usedTodayMinutes: { type: Number, default: 0 },
        usedWeekMinutes: { type: Number, default: 0 },
        weeklySchedule: {
            type: [DayScheduleSchema],
            default: []
        }
    },
    { _id: false }
);