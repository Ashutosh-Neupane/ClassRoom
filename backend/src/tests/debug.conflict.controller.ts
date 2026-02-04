import { Request, Response } from "express";
import { checkScheduleConflicts } from "../modules/schedule/conflict.engine";
import { ScheduleRule } from "../modules/schedule/schedule.model";
import { generateOccurrences } from "../modules/schedule/recurrence.engine";
import { sendSuccess } from "../utils/apiResponse";
import { Types } from "mongoose";
import dayjs from "dayjs";

export const debugConflictDetection = async (req: Request, res: Response) => {
  try {
    const roomId = new Types.ObjectId();
    const instructorId = new Types.ObjectId();
    
    const startDate = dayjs().add(1, 'day').toDate();
    const endDate = dayjs().add(30, 'day').toDate();

    // Create and save first rule
    const rule1 = new ScheduleRule({
      classType: "Morning Yoga",
      instructor: instructorId,
      room: roomId,
      duration: 60,
      startDate,
      endDate,
      recurrenceType: "WEEKLY",
      weeklyDays: ["MON"],
      timeSlots: ["09:00"],
      interval: 1
    });
    
    await rule1.save();

    // Create conflicting rule (not saved yet)
    const rule2 = new ScheduleRule({
      classType: "Advanced Yoga", 
      instructor: new Types.ObjectId(), // Different instructor
      room: roomId, // Same room
      duration: 90,
      startDate,
      endDate,
      recurrenceType: "WEEKLY",
      weeklyDays: ["MON"], // Same day
      timeSlots: ["09:30"], // Overlapping time
      interval: 1
    });

    // Debug: Generate occurrences for both rules
    const from = new Date();
    const to = dayjs(from).add(60, "day").toDate();
    
    const rule1Occurrences = generateOccurrences(rule1, from, to);
    const rule2Occurrences = generateOccurrences(rule2, from, to);

    // Debug: Check existing rules in database
    const existingRules = await ScheduleRule.find({
      _id: { $ne: rule2._id },
      $or: [
        {
          startDate: { $lte: rule2.endDate },
          endDate: { $gte: rule2.startDate },
        },
      ],
    });

    // Test conflict detection
    let conflictResult = "NO_CONFLICT";
    let conflictMessage = "";
    
    try {
      await checkScheduleConflicts(rule2);
    } catch (error) {
      conflictResult = "CONFLICT_DETECTED";
      conflictMessage = error instanceof Error ? error.message : "Unknown error";
    }

    // Clean up
    await ScheduleRule.deleteOne({ _id: rule1._id });

    sendSuccess(res, 200, {
      title: "Debug Conflict Detection",
      message: "Detailed conflict detection analysis",
      data: {
        conflictResult,
        conflictMessage,
        debug: {
          rule1Occurrences: rule1Occurrences.slice(0, 3), // First 3 occurrences
          rule2Occurrences: rule2Occurrences.slice(0, 3),
          existingRulesFound: existingRules.length,
          dateRange: {
            from: from.toISOString(),
            to: to.toISOString()
          },
          roomMatch: existingRules.length > 0 ? existingRules[0].room.toString() === rule2.room.toString() : false
        }
      }
    });

  } catch (error) {
    sendSuccess(res, 500, {
      title: "Debug Failed",
      message: error instanceof Error ? error.message : "Unknown error",
      data: {}
    });
  }
};