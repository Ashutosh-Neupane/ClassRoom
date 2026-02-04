import { Request, Response } from "express";
import { Instructor } from "../modules/instructor/instructor.model";
import { Room } from "../modules/room/room.model";
import { createScheduleService } from "../modules/schedule/schedule.service";
import { createScheduleSchema } from "../modules/schedule/schedule.validation";
import { sendSuccess } from "../utils/apiResponse";
import dayjs from "dayjs";

export const runScheduleAPITests = async (req: Request, res: Response) => {
  const testResults = [];

  try {
    // Create test instructor and room
    const instructor = new Instructor({ name: "Test Instructor" });
    const room = new Room({ name: "Test Room", capacity: 20 });
    
    await instructor.save();
    await room.save();

    const startDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(30, 'day').format('YYYY-MM-DD');

    // Test 1: Valid one-time class
    try {
      const payload1 = {
        classType: "Yoga Flow",
        instructor: instructor._id.toString(),
        room: room._id.toString(),
        duration: 60,
        startDate,
        endDate: startDate,
        recurrenceType: "NONE" as const,
        timeSlots: ["09:00"]
      };

      const validated1 = createScheduleSchema.parse(payload1);
      const result1 = await createScheduleService(validated1);
      
      testResults.push({
        test: "Valid one-time class",
        result: "PASS",
        message: `Created schedule with ID: ${result1._id}`
      });

      // Clean up
      await result1.deleteOne();

    } catch (error) {
      testResults.push({
        test: "Valid one-time class",
        result: "FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 2: Valid weekly recurring
    try {
      const payload2 = {
        classType: "Crossfit",
        instructor: instructor._id.toString(),
        room: room._id.toString(),
        duration: 60,
        startDate,
        endDate,
        recurrenceType: "WEEKLY" as const,
        weeklyDays: ["MON", "THU"],
        timeSlots: ["09:00", "17:00"]
      };

      const validated2 = createScheduleSchema.parse(payload2);
      const result2 = await createScheduleService(validated2);
      
      testResults.push({
        test: "Valid weekly recurring",
        result: "PASS", 
        message: `Created recurring schedule with ID: ${result2._id}`
      });

      // Clean up
      await result2.deleteOne();

    } catch (error) {
      testResults.push({
        test: "Valid weekly recurring",
        result: "FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 3: Invalid payload (missing classType)
    try {
      const invalidPayload = {
        instructor: instructor._id.toString(),
        room: room._id.toString(),
        duration: 60,
        startDate,
        endDate,
        recurrenceType: "WEEKLY" as const,
        timeSlots: ["09:00"]
      };

      createScheduleSchema.parse(invalidPayload);
      
      testResults.push({
        test: "Invalid payload validation",
        result: "UNEXPECTED_PASS",
        message: "Should have failed validation"
      });

    } catch (error) {
      testResults.push({
        test: "Invalid payload validation",
        result: "EXPECTED_FAIL",
        message: "Validation correctly caught missing classType"
      });
    }

    // Test 4: Conflict detection
    try {
      // Create first schedule
      const schedule1 = {
        classType: "Morning Yoga",
        instructor: instructor._id.toString(),
        room: room._id.toString(),
        duration: 60,
        startDate,
        endDate,
        recurrenceType: "WEEKLY" as const,
        weeklyDays: ["MON"],
        timeSlots: ["09:00"]
      };

      const validated3 = createScheduleSchema.parse(schedule1);
      const result3 = await createScheduleService(validated3);

      // Try to create conflicting schedule
      const conflictingSchedule = {
        classType: "Advanced Yoga",
        instructor: instructor._id.toString(), // Different instructor
        room: room._id.toString(), // Same room - should conflict
        duration: 90,
        startDate,
        endDate,
        recurrenceType: "WEEKLY" as const,
        weeklyDays: ["MON"],
        timeSlots: ["09:30"] // Overlapping time
      };

      const validated4 = createScheduleSchema.parse(conflictingSchedule);
      await createScheduleService(validated4);

      testResults.push({
        test: "Conflict detection",
        result: "UNEXPECTED_PASS",
        message: "Should have detected room conflict"
      });

      // Clean up
      await result3.deleteOne();

    } catch (error) {
      testResults.push({
        test: "Conflict detection",
        result: "EXPECTED_FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Clean up test data
    await Instructor.deleteOne({ _id: instructor._id });
    await Room.deleteOne({ _id: room._id });

    sendSuccess(res, 200, {
      title: "Schedule API Tests Complete",
      message: "Automated testing of schedule creation API",
      data: {
        testResults,
        summary: {
          total: testResults.length,
          passed: testResults.filter(t => t.result === "PASS" || t.result === "EXPECTED_FAIL").length,
          failed: testResults.filter(t => t.result === "FAIL" || t.result === "UNEXPECTED_PASS").length
        }
      }
    });

  } catch (error) {
    sendSuccess(res, 500, {
      title: "Test Suite Failed",
      message: error instanceof Error ? error.message : "Unknown error",
      data: { testResults }
    });
  }
};