import dayjs from "dayjs";
import { IScheduleRule, ScheduleRule } from "./schedule.model";
import { generateOccurrences } from "./recurrence.engine";

// Helper function to check if two time ranges overlap
const isTimeOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
) => {
  return startA < endB && startB < endA;
};

export const checkScheduleConflicts = async (
  newRule: IScheduleRule
): Promise<void> => {
  // Only check for next 60 days for performance
  const from = new Date();
  const to = dayjs(from).add(60, "day").toDate();

  const newOccurrences = generateOccurrences(newRule, from, to);

  // Find rules with overlapping date range
  const existingRules = await ScheduleRule.find({
    _id: { $ne: newRule._id },
    $or: [
      {
        startDate: { $lte: newRule.endDate },
        endDate: { $gte: newRule.startDate },
      },
    ],
  });

  for (const rule of existingRules) {
    const existingOccurrences = generateOccurrences(rule, from, to);

    for (const newOcc of newOccurrences) {
      for (const exOcc of existingOccurrences) {
        if (newOcc.date !== exOcc.date) continue;

        const overlap = isTimeOverlap(
          newOcc.startTime,
          newOcc.endTime,
          exOcc.startTime,
          exOcc.endTime
        );

        if (!overlap) continue;

        // Same room conflict
        if (rule.room.toString() === newRule.room.toString()) {
          throw new Error(
            `Room conflict on ${newOcc.date} at ${newOcc.startTime}`
          );
        }

        // Same instructor conflict
        if (rule.instructor.toString() === newRule.instructor.toString()) {
          throw new Error(
            `Instructor conflict on ${newOcc.date} at ${newOcc.startTime}`
          );
        }
      }
    }
  }
};