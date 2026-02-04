import { Request, Response } from "express";
import { Instructor } from "../modules/instructor/instructor.model";
import { Room } from "../modules/room/room.model";
import { createScheduleService, updateScheduleService, deleteScheduleService, getCalendarSchedulesService } from "../modules/schedule/schedule.service";
import { createScheduleSchema, updateScheduleSchema } from "../modules/schedule/schedule.validation";
import { sendSuccess } from "../utils/apiResponse";
import dayjs from "dayjs";

export const testUpdateDeleteAPI = async (req: Request, res: Response) => {
  const testResults = [];

  try {
    // Create test instructor and room
    const instructor = new Instructor({ name: "Test Instructor" });
    const room = new Room({ name: "Test Room", capacity: 30 });
    
    await instructor.save();
    await room.save();

    const startDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(30, 'day').format('YYYY-MM-DD');

    // Test 1: Create a schedule to test with
    let createdSchedule;
    try {
      const schedulePayload = {
        classType: "Original Yoga",
        instructor: instructor._id.toString(),
        room: room._id.toString(),
        duration: 60,
        startDate,
        endDate,
        recurrenceType: "WEEKLY" as const,
        weeklyDays: ["MON", "WED"],
        timeSlots: ["09:00"]
      };

      const validated = createScheduleSchema.parse(schedulePayload);
      createdSchedule = await createScheduleService(validated);
      
      testResults.push({
        test: "Create schedule for testing",
        result: "PASS",
        message: `Created schedule with ID: ${createdSchedule._id}`
      });

    } catch (error) {
      testResults.push({
        test: "Create schedule for testing",
        result: "FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
      throw error; // Can't continue without a schedule
    }

    // Test 2: Update schedule (partial update)
    try {
      const updatePayload = {
        classType: "Updated Yoga Flow",
        timeSlots: ["10:00", "16:00"],
        weeklyDays: ["TUE", "THU", "FRI"]
      };

      const validatedUpdate = updateScheduleSchema.parse(updatePayload);
      const updatedSchedule = await updateScheduleService(createdSchedule._id.toString(), validatedUpdate);
      
      testResults.push({
        test: "Update schedule",
        result: "PASS",
        message: `Updated schedule: ${updatedSchedule.classType}, timeSlots: ${updatedSchedule.timeSlots.join(', ')}`
      });

    } catch (error) {
      testResults.push({
        test: "Update schedule",
        result: "FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 3: Test calendar shows updated schedule
    try {
      const calendarFrom = dayjs().add(1, 'day').toDate();
      const calendarTo = dayjs().add(14, 'day').toDate();
      
      const calendarEvents = await getCalendarSchedulesService(calendarFrom, calendarTo);
      const updatedEvents = calendarEvents.filter(event => event.title === "Updated Yoga Flow");
      
      testResults.push({
        test: "Calendar reflects updates",
        result: updatedEvents.length > 0 ? "PASS" : "FAIL",
        message: `Found ${updatedEvents.length} updated events in calendar`
      });

    } catch (error) {
      testResults.push({
        test: "Calendar reflects updates",
        result: "FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 4: Update with conflict (should fail)
    try {
      // Create another schedule first
      const conflictSchedule = {
        classType: "Conflict Test",
        instructor: instructor._id.toString(),
        room: room._id.toString(),
        duration: 60,
        startDate,
        endDate,
        recurrenceType: "WEEKLY" as const,
        weeklyDays: ["SAT"],
        timeSlots: ["14:00"]
      };

      const validatedConflict = createScheduleSchema.parse(conflictSchedule);
      const conflictScheduleCreated = await createScheduleService(validatedConflict);

      // Try to update original schedule to conflict
      const conflictUpdate = {
        weeklyDays: ["SAT"],
        timeSlots: ["14:30"] // Should overlap with 14:00-15:00
      };

      const validatedConflictUpdate = updateScheduleSchema.parse(conflictUpdate);
      await updateScheduleService(createdSchedule._id.toString(), validatedConflictUpdate);
      
      testResults.push({
        test: "Update with conflict detection",
        result: "UNEXPECTED_PASS",
        message: "Should have detected room conflict"
      });

      // Clean up conflict schedule
      await conflictScheduleCreated.deleteOne();

    } catch (error) {
      testResults.push({
        test: "Update with conflict detection",
        result: "EXPECTED_FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 5: Delete schedule
    try {
      await deleteScheduleService(createdSchedule._id.toString());
      
      testResults.push({
        test: "Delete schedule",
        result: "PASS",
        message: "Schedule deleted successfully"
      });

    } catch (error) {
      testResults.push({
        test: "Delete schedule",
        result: "FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 6: Verify calendar no longer shows deleted schedule
    try {
      const calendarFrom = dayjs().add(1, 'day').toDate();
      const calendarTo = dayjs().add(14, 'day').toDate();
      
      const calendarEvents = await getCalendarSchedulesService(calendarFrom, calendarTo);
      const deletedEvents = calendarEvents.filter(event => event.title === "Updated Yoga Flow");
      
      testResults.push({
        test: "Calendar reflects deletion",
        result: deletedEvents.length === 0 ? "PASS" : "FAIL",
        message: `Found ${deletedEvents.length} events after deletion (should be 0)`
      });

    } catch (error) {
      testResults.push({
        test: "Calendar reflects deletion",
        result: "FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 7: Delete non-existent schedule (should fail)
    try {
      await deleteScheduleService("507f1f77bcf86cd799439011"); // Fake ObjectId
      
      testResults.push({
        test: "Delete non-existent schedule",
        result: "UNEXPECTED_PASS",
        message: "Should have failed with 'not found'"
      });

    } catch (error) {
      testResults.push({
        test: "Delete non-existent schedule",
        result: "EXPECTED_FAIL",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Clean up test data
    await Instructor.deleteOne({ _id: instructor._id });
    await Room.deleteOne({ _id: room._id });

    sendSuccess(res, 200, {
      title: "Update & Delete API Tests Complete",
      message: "Comprehensive testing of schedule update and delete operations",
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
      title: "Update & Delete Test Suite Failed",
      message: error instanceof Error ? error.message : "Unknown error",
      data: { testResults }
    });
  }
};