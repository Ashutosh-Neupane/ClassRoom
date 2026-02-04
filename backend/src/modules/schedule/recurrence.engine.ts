import dayjs from "dayjs";
import { IScheduleRule } from "./schedule.model";

export interface Occurrence {
  date: string;     // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

// Helper function to add minutes to time
const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  return dayjs().hour(h).minute(m).add(minutes, "minute").format("HH:mm");
};

export const generateOccurrences = (
  rule: IScheduleRule,
  from: Date,
  to: Date
): Occurrence[] => {
  const occurrences: Occurrence[] = [];

  const fromDate = dayjs(from);
  const toDate = dayjs(to);

  const ruleStart = dayjs(rule.startDate);
  const ruleEnd = dayjs(rule.endDate);

  // Restrict range inside rule window
  const start = fromDate.isAfter(ruleStart) ? fromDate : ruleStart;
  const end = toDate.isBefore(ruleEnd) ? toDate : ruleEnd;

  if (start.isAfter(end)) return [];

  const pushForDate = (date: dayjs.Dayjs) => {
    rule.timeSlots.forEach((slot) => {
      occurrences.push({
        date: date.format("YYYY-MM-DD"),
        startTime: slot,
        endTime: addMinutes(slot, rule.duration),
      });
    });
  };

  // NONE (one-time class)
  if (rule.recurrenceType === "NONE") {
    pushForDate(ruleStart);
    return occurrences;
  }

  // DAILY
  if (rule.recurrenceType === "DAILY") {
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      pushForDate(current);
      current = current.add(rule.interval || 1, "day");
    }
  }

  // WEEKLY
  if (rule.recurrenceType === "WEEKLY") {
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const dayCode = current.format("ddd").toUpperCase().slice(0, 3); // MON

      if (rule.weeklyDays?.includes(dayCode)) {
        pushForDate(current);
      }

      current = current.add(1, "day");
    }
  }

  // MONTHLY
  if (rule.recurrenceType === "MONTHLY") {
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const dateNum = current.date();

      if (rule.monthlyDates?.includes(dateNum)) {
        pushForDate(current);
      }

      current = current.add(1, "day");
    }
  }

  // CUSTOM (weeklyDays + interval weeks)
  if (rule.recurrenceType === "CUSTOM") {
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const diffWeeks = current.diff(ruleStart, "week");
      const dayCode = current.format("ddd").toUpperCase().slice(0, 3);

      if (
        rule.weeklyDays?.includes(dayCode) &&
        diffWeeks % (rule.interval || 1) === 0
      ) {
        pushForDate(current);
      }

      current = current.add(1, "day");
    }
  }

  return occurrences;
};