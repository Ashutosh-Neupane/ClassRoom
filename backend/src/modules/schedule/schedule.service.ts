import { ScheduleRule } from "./schedule.model";
import { checkScheduleConflicts } from "./conflict.engine";
import { generateOccurrences } from "./recurrence.engine";
import dayjs from "dayjs";

export const getAllSchedulesService = async () => {
  const schedules = await ScheduleRule.find()
    .populate("instructor")
    .populate("room")
    .sort({ createdAt: -1 });

  return schedules;
};

export const createScheduleService = async (payload: any) => {
  const schedule = new ScheduleRule(payload);

  // Conflict check before save
  await checkScheduleConflicts(schedule);

  await schedule.save();

  return schedule;
};

export const updateScheduleService = async (
  id: string,
  payload: any
) => {
  const existing = await ScheduleRule.findById(id);

  if (!existing) {
    throw new Error("Schedule not found");
  }

  // Merge old + new
  const updatedRule = Object.assign(existing, payload);

  // Check conflicts with updated data
  await checkScheduleConflicts(updatedRule);

  await updatedRule.save();

  return updatedRule;
};

export const deleteScheduleService = async (id: string) => {
  const existing = await ScheduleRule.findById(id);

  if (!existing) {
    throw new Error("Schedule not found");
  }

  await existing.deleteOne();
};

export const getCalendarSchedulesService = async (
  from: Date,
  to: Date
) => {
  // Find rules overlapping this range
  const rules = await ScheduleRule.find({
    startDate: { $lte: to },
    endDate: { $gte: from },
  })
    .populate("instructor")
    .populate("room");

  const events: any[] = [];

  for (const rule of rules) {
    const occurrences = generateOccurrences(rule, from, to);

    occurrences.forEach((occ) => {
      // Map backend data to frontend ClassEvent format
      events.push({
        id: `${rule._id}-${occ.date}-${occ.startTime}`,
        title: rule.classType,
        classType: rule.classType, // Keep both for compatibility
        date: new Date(occ.date),
        time: occ.startTime,
        startTime: occ.startTime,
        endTime: occ.endTime,
        duration: rule.duration,
        instructor: rule.instructor && (rule.instructor as any).name ? (rule.instructor as any).name : "Unknown Instructor",
        room: rule.room && (rule.room as any).name ? (rule.room as any).name : "Unknown Room",
        capacity: rule.room && (rule.room as any).capacity ? (rule.room as any).capacity : 20,
        booked: Math.floor(Math.random() * ((rule.room as any)?.capacity || 20)), // Random booking data
        status: ['scheduled', 'completed', 'cancelled'][Math.floor(Math.random() * 3)] as 'scheduled' | 'completed' | 'cancelled',
        type: rule.classType.toLowerCase().includes('crossfit') ? 'crossfit' : 
              rule.classType.toLowerCase().includes('yoga') ? 'yoga' : 'workshop',
        isRecurring: rule.recurrenceType !== 'NONE',
        recurringDays: rule.weeklyDays || [],
        ruleId: rule._id.toString(),
      });
    });
  }

  return events;
};