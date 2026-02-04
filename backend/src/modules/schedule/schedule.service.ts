import { ScheduleRule } from "./schedule.model";
import { checkScheduleConflicts } from "./conflict.engine";
import { RecurrenceEngine } from "./recurrence.engine";
import dayjs from "dayjs";

export const getAllSchedulesService = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  const [schedules, total] = await Promise.all([
    ScheduleRule.find()
      .populate("instructor")
      .populate("room")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ScheduleRule.countDocuments()
  ]);

  return { schedules, total };
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
    // Generate basic occurrences - simplified for now
    const occurrences = RecurrenceEngine.generateOccurrences({
      pattern: 'daily',
      startDate: from,
      endDate: to,
      timeSlots: [{ hour: 9, minute: 0 }]
    });

    occurrences.forEach((occ) => {
      // Map backend data to frontend ClassEvent format
      events.push({
        id: `${rule._id}-${occ.date.getTime()}`,
        title: rule.classType,
        classType: rule.classType,
        date: occ.date,
        time: '09:00',
        startTime: '09:00',
        endTime: '10:00',
        duration: rule.duration,
        instructor: rule.instructor && (rule.instructor as any).name ? (rule.instructor as any).name : "Unknown Instructor",
        room: rule.room && (rule.room as any).name ? (rule.room as any).name : "Unknown Room",
        capacity: rule.room && (rule.room as any).capacity ? (rule.room as any).capacity : 20,
        booked: Math.floor(Math.random() * ((rule.room as any)?.capacity || 20)),
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