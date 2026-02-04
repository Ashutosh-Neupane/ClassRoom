import { Request, Response } from "express";
import { checkScheduleConflicts } from "../modules/schedule/conflict.engine";
import { ScheduleRule, IScheduleRule } from "../modules/schedule/schedule.model";
import { Instructor } from "../modules/instructor/instructor.model";
import { Room } from "../modules/room/room.model";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { Types } from "mongoose";
import dayjs from "dayjs";

export const testConflictDetection = async (req: Request, res: Response) => {
  try {
    // Create sample instructor and room for testing
    const instructor = new Instructor({ name: "John Doe" });
    const room = new Room({ name: "Room A", capacity: 30 });

    // Use current date + 1 day to ensure it's in the future
    const startDate = dayjs().add(1, 'day').toDate();
    const endDate = dayjs().add(30, 'day').toDate();

    // Test Case 1: Create a rule that should work (no conflicts)
    const rule1: IScheduleRule = new ScheduleRule({
      classType: "Morning Yoga",
      instructor: instructor._id,
      room: room._id,
      duration: 60,
      startDate,
      endDate,
      recurrenceType: "WEEKLY",
      weeklyDays: ["MON", "WED"],
      timeSlots: ["09:00"],
      interval: 1
    });

    // Test Case 2: Create a conflicting rule (same room, overlapping time)
    const conflictingRule: IScheduleRule = new ScheduleRule({
      classType: "Advanced Yoga",
      instructor: new Types.ObjectId(), // Different instructor
      room: room._id, // Same room - should cause conflict
      duration: 90,
      startDate,
      endDate,
      recurrenceType: "WEEKLY",
      weeklyDays: ["MON"], // Same day
      timeSlots: ["09:30"], // Overlapping time (9:00-10:00 vs 9:30-11:00)
      interval: 1
    });

    const testResults = [];

    // Test 1: Check rule1 (should pass - no existing rules)
    try {
      await checkScheduleConflicts(rule1);
      testResults.push({
        test: "Rule 1 - Morning Yoga",
        result: "PASS",
        message: "No conflicts detected"
      });
    } catch (error) {
      testResults.push({
        test: "Rule 1 - Morning Yoga", 
        result: "FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Save rule1 to database for next test
    await rule1.save();

    // Test 2: Check conflicting rule (should fail - room conflict)
    try {
      await checkScheduleConflicts(conflictingRule);
      testResults.push({
        test: "Rule 2 - Conflicting Rule",
        result: "UNEXPECTED_PASS",
        message: "Should have detected room conflict"
      });
    } catch (error) {
      testResults.push({
        test: "Rule 2 - Conflicting Rule",
        result: "EXPECTED_FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Clean up test data
    await ScheduleRule.deleteOne({ _id: rule1._id });

    sendSuccess(res, 200, {
      title: "Conflict Detection Test",
      message: "Tested conflict detection engine with room and time overlaps",
      data: {
        testResults,
        testDates: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          checkingPeriod: "Next 60 days from today"
        },
        explanation: {
          rule1: {
            classType: rule1.classType,
            schedule: "Monday & Wednesday 9:00 AM",
            duration: "60 minutes"
          },
          conflictingRule: {
            classType: conflictingRule.classType,
            schedule: "Monday 9:30 AM", 
            duration: "90 minutes",
            conflict: "Same room, overlapping time (9:00-10:00 vs 9:30-11:00)"
          }
        }
      }
    });

  } catch (error) {
    sendError(res, 500, {
      title: "Conflict Test Failed",
      message: "Error testing conflict detection engine"
    });
  }
};