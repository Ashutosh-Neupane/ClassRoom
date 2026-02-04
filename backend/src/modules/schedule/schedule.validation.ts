import { z } from "zod";

const timeSlotSchema = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59)
});

const recurrenceRuleSchema = z.object({
  pattern: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  interval: z.number().min(1).optional(),
  
  // Daily pattern
  timeSlots: z.array(timeSlotSchema).optional(),
  
  // Weekly pattern
  weeklySchedule: z.record(z.string(), z.array(timeSlotSchema)).optional(),
  
  // Monthly pattern
  monthlySchedule: z.record(z.string(), z.array(timeSlotSchema)).optional(),
  
  // Custom pattern
  customSchedule: z.record(z.string(), z.array(timeSlotSchema)).optional()
});

export const createScheduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  classType: z.string().min(1, "Class type is required"),
  instructor: z.string().min(1, "Instructor is required"),
  room: z.string().min(1, "Room is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  waitingListCapacity: z.number().min(0).default(0),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  dropInAvailability: z.boolean().default(true),
  
  // Single event fields
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  date: z.string().optional(),
  
  // Recurring event fields
  isRecurring: z.boolean().default(false),
  recurrenceRule: recurrenceRuleSchema.optional()
}).refine((data) => {
  if (!data.isRecurring) {
    return data.date && data.startTime && data.endTime;
  } else {
    return data.recurrenceRule;
  }
}, {
  message: "Either provide date/startTime/endTime for single event or recurrenceRule for recurring event"
});

export const updateScheduleSchema = createScheduleSchema.partial();