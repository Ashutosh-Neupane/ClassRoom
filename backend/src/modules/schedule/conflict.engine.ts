import dayjs from "dayjs";
import { IScheduleRule, ScheduleRule } from "./schedule.model";
import { RecurrenceEngine } from "./recurrence.engine";

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

  // Generate occurrences using RecurrenceEngine
  const newOccurrences = RecurrenceEngine.generateOccurrences({
    pattern: 'daily',
    startDate: from,
    endDate: to,
    timeSlots: [{ hour: 9, minute: 0 }]
  });

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
    const existingOccurrences = RecurrenceEngine.generateOccurrences({
      pattern: 'daily',
      startDate: from,
      endDate: to,
      timeSlots: [{ hour: 9, minute: 0 }]
    });

    // Basic conflict check - simplified for now
    if (existingOccurrences.length > 0 && newOccurrences.length > 0) {
      console.log(`Checking conflicts between rules`);
    }
  }
};