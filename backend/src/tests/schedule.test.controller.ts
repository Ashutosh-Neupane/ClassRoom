import { Request, Response } from "express";
import { Instructor } from "../modules/instructor/instructor.model";
import { Room } from "../modules/room/room.model";
import { sendSuccess } from "../utils/apiResponse";
import dayjs from "dayjs";

export const testScheduleAPI = async (req: Request, res: Response) => {
  try {
    // Create test instructor and room
    const instructor = new Instructor({ name: "Test Instructor" });
    const room = new Room({ name: "Test Room", capacity: 20 });
    
    await instructor.save();
    await room.save();

    const startDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(30, 'day').format('YYYY-MM-DD');

    // Test payloads
    const testPayloads = [
      {
        name: "One-time class",
        payload: {
          classType: "Yoga Flow",
          instructor: instructor._id.toString(),
          room: room._id.toString(),
          duration: 60,
          startDate,
          endDate: startDate, // Same day for one-time
          recurrenceType: "NONE",
          timeSlots: ["09:00"]
        }
      },
      {
        name: "Weekly recurring",
        payload: {
          classType: "Crossfit",
          instructor: instructor._id.toString(),
          room: room._id.toString(),
          duration: 60,
          startDate,
          endDate,
          recurrenceType: "WEEKLY",
          weeklyDays: ["MON", "THU"],
          timeSlots: ["09:00", "17:00"]
        }
      },
      {
        name: "Invalid payload (missing classType)",
        payload: {
          instructor: instructor._id.toString(),
          room: room._id.toString(),
          duration: 60,
          startDate,
          endDate,
          recurrenceType: "WEEKLY",
          timeSlots: ["09:00"]
        }
      }
    ];

    // Clean up test data
    await Instructor.deleteOne({ _id: instructor._id });
    await Room.deleteOne({ _id: room._id });

    sendSuccess(res, 200, {
      title: "Schedule API Test Data",
      message: "Use these payloads to test POST /api/schedule",
      data: {
        endpoint: "POST /api/schedule",
        testInstructor: instructor._id.toString(),
        testRoom: room._id.toString(),
        testPayloads,
        instructions: [
          "1. Test each payload with POST /api/schedule",
          "2. First two should succeed",
          "3. Third should fail with validation error",
          "4. Try creating conflicting schedules to test conflict detection"
        ]
      }
    });

  } catch (error) {
    sendSuccess(res, 500, {
      title: "Test Setup Failed",
      message: error instanceof Error ? error.message : "Unknown error",
      data: {}
    });
  }
};