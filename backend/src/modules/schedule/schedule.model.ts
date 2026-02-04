import mongoose, { Schema, Document, Types } from "mongoose";

export type RecurrenceType = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";

export interface IScheduleRule extends Document {
  classType: string;
  instructor: Types.ObjectId;
  room: Types.ObjectId;
  duration: number; // in minutes
  startDate: Date;
  endDate: Date;
  recurrenceType: RecurrenceType;
  weeklyDays?: string[]; // ["MON", "TUE"]
  monthlyDates?: number[]; // [5,20]
  timeSlots: string[]; // ["09:00", "14:00"]
  interval?: number; // every n days/weeks
  attachment?: string; // file path
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleRuleSchema: Schema = new Schema(
  {
    classType: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "Instructor", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    recurrenceType: {
      type: String,
      enum: ["NONE", "DAILY", "WEEKLY", "MONTHLY", "CUSTOM"],
      default: "NONE",
    },
    weeklyDays: [{ type: String, enum: ["SUN","MON","TUE","WED","THU","FRI","SAT"] }],
    monthlyDates: [{ type: Number, min: 1, max: 31 }],
    timeSlots: [{ type: String, required: true }], // "HH:mm"
    interval: { type: Number, default: 1 }, // every n days/weeks
    attachment: { type: String }, // file path
  },
  { timestamps: true }
);

export const ScheduleRule = mongoose.model<IScheduleRule>("ScheduleRule", ScheduleRuleSchema);