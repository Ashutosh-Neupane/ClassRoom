import { ScheduleRule } from "./schedule.model";
import { checkScheduleConflicts } from "./conflict.engine";

export const createScheduleService = async (payload: any) => {
  const schedule = new ScheduleRule(payload);

  // Conflict check before save
  await checkScheduleConflicts(schedule);

  await schedule.save();

  return schedule;
};