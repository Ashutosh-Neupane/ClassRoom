import { z } from "zod";

export const createScheduleSchema = z.object({
  classType: z.string(),
  instructor: z.string(),
  room: z.string(),
  duration: z.number().min(1),
  startDate: z.string(),
  endDate: z.string(),
  recurrenceType: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY", "CUSTOM"]),
  weeklyDays: z.array(z.string()).optional(),
  monthlyDates: z.array(z.number()).optional(),
  timeSlots: z.array(z.string()),
  interval: z.number().optional(),
});

export const updateScheduleSchema = createScheduleSchema.partial();