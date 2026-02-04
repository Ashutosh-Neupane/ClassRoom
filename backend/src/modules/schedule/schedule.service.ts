import { ScheduleRule } from "./schedule.model";
import { checkScheduleConflicts } from "./conflict.engine";
import { generateOccurrences } from "./recurrence.engine";
import dayjs from "dayjs";

export const createScheduleService = async (payload: any) => {
  const schedule = new ScheduleRule(payload);

  // Conflict check before save
  await checkScheduleConflicts(schedule);

  await schedule.save();

  return schedule;
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
      events.push({
        title: rule.classType,
        date: occ.date,
        startTime: occ.startTime,
        endTime: occ.endTime,
        instructor: rule.instructor && (rule.instructor as any).name ? (rule.instructor as any).name : "Unknown Instructor",
        room: rule.room && (rule.room as any).name ? (rule.room as any).name : "Unknown Room",
      });
    });
  }

  return events;
};