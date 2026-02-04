import { Request, Response } from "express";
import { generateOccurrences } from "../modules/schedule/recurrence.engine";
import { IScheduleRule } from "../modules/schedule/schedule.model";
import { sendSuccess } from "../utils/apiResponse";
import { Types } from "mongoose";

export const testRecurrenceEngine = async (req: Request, res: Response) => {
  // Sample rule: Yoga every Monday & Thursday, 9 AM and 5 PM
  const sampleRule: IScheduleRule = {
    classType: "Yoga Flow",
    instructor: new Types.ObjectId(),
    room: new Types.ObjectId(),
    duration: 60,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-29"),
    recurrenceType: "WEEKLY",
    weeklyDays: ["MON", "THU"],
    timeSlots: ["09:00", "17:00"],
    interval: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  } as IScheduleRule;

  // Test different date ranges
  const testCases = [
    {
      name: "First Week of February",
      from: new Date("2024-02-01"),
      to: new Date("2024-02-07")
    },
    {
      name: "Entire February",
      from: new Date("2024-02-01"),
      to: new Date("2024-02-29")
    },
    {
      name: "Mid February Week",
      from: new Date("2024-02-12"),
      to: new Date("2024-02-18")
    }
  ];

  const results = testCases.map(testCase => ({
    ...testCase,
    occurrences: generateOccurrences(sampleRule, testCase.from, testCase.to)
  }));

  sendSuccess(res, 200, {
    title: "Recurrence Engine Test",
    message: "Generated class occurrences for different date ranges",
    data: {
      rule: {
        classType: sampleRule.classType,
        recurrenceType: sampleRule.recurrenceType,
        weeklyDays: sampleRule.weeklyDays,
        timeSlots: sampleRule.timeSlots,
        duration: sampleRule.duration
      },
      testResults: results
    }
  });
};