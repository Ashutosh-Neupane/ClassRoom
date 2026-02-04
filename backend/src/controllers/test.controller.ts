import { Request, Response } from "express";
import { ScheduleRule } from "../modules/schedule/schedule.model";
import { Instructor } from "../modules/instructor/instructor.model";
import { Room } from "../modules/room/room.model";
import { sendSuccess, sendError } from "../utils/apiResponse";

export const testModels = async (req: Request, res: Response) => {
  try {
    // Test creating sample data
    const instructor = new Instructor({ name: "John Doe" });
    const room = new Room({ name: "Room A", capacity: 30 });
    
    // Test ScheduleRule structure (don't save, just validate)
    const scheduleRule = new ScheduleRule({
      classType: "Yoga Flow",
      instructor: instructor._id,
      room: room._id,
      duration: 60,
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-02-28"),
      recurrenceType: "WEEKLY",
      weeklyDays: ["MON", "THU"],
      timeSlots: ["09:00", "17:00"],
      interval: 1
    });

    // Validate without saving
    const validationError = scheduleRule.validateSync();
    
    if (validationError) {
      return sendError(res, 400, {
        title: "Model Validation Failed",
        message: "Schema validation errors found",
        errors: Object.values(validationError.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    sendSuccess(res, 200, {
      title: "Models Test Passed",
      message: "All database models are correctly structured",
      data: {
        scheduleRule: {
          classType: scheduleRule.classType,
          recurrenceType: scheduleRule.recurrenceType,
          weeklyDays: scheduleRule.weeklyDays,
          timeSlots: scheduleRule.timeSlots,
          duration: scheduleRule.duration
        },
        instructor: { name: instructor.name },
        room: { name: room.name, capacity: room.capacity }
      }
    });

  } catch (error) {
    sendError(res, 500, {
      title: "Model Test Failed",
      message: "Error testing database models"
    });
  }
};