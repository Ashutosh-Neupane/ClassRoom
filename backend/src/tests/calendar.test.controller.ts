import { Request, Response } from "express";
import { Instructor } from "../modules/instructor/instructor.model";
import { Room } from "../modules/room/room.model";
import { createScheduleService, getCalendarSchedulesService } from "../modules/schedule/schedule.service";
import { createScheduleSchema } from "../modules/schedule/schedule.validation";
import { sendSuccess } from "../utils/apiResponse";
import dayjs from "dayjs";

export const testCalendarAPI = async (req: Request, res: Response) => {
  try {
    // Create test instructor and room
    const instructor = new Instructor({ name: "John Smith" });
    const room = new Room({ name: "Main Studio", capacity: 30 });
    
    await instructor.save();
    await room.save();

    const startDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const endDate = dayjs().add(30, 'day').format('YYYY-MM-DD');

    // Create a test schedule
    const schedulePayload = {
      classType: "Yoga Flow",
      instructor: instructor._id.toString(),
      room: room._id.toString(),
      duration: 60,
      startDate,
      endDate,
      recurrenceType: "WEEKLY" as const,
      weeklyDays: ["MON", "WED", "FRI"],
      timeSlots: ["09:00", "17:00"]
    };

    const validated = createScheduleSchema.parse(schedulePayload);
    const createdSchedule = await createScheduleService(validated);

    // Test calendar API with the created schedule
    const calendarFrom = dayjs().add(1, 'day').toDate();
    const calendarTo = dayjs().add(14, 'day').toDate();
    
    const calendarEvents = await getCalendarSchedulesService(calendarFrom, calendarTo);

    // Clean up
    await createdSchedule.deleteOne();
    await Instructor.deleteOne({ _id: instructor._id });
    await Room.deleteOne({ _id: room._id });

    sendSuccess(res, 200, {
      title: "Calendar API Test Complete",
      message: "Created schedule and tested calendar projection",
      data: {
        createdSchedule: {
          id: createdSchedule._id,
          classType: createdSchedule.classType,
          recurrenceType: createdSchedule.recurrenceType,
          weeklyDays: createdSchedule.weeklyDays,
          timeSlots: createdSchedule.timeSlots
        },
        calendarQuery: {
          from: calendarFrom.toISOString(),
          to: calendarTo.toISOString()
        },
        calendarEvents,
        eventsCount: calendarEvents.length,
        sampleEvent: calendarEvents[0] || null
      }
    });

  } catch (error) {
    sendSuccess(res, 500, {
      title: "Calendar API Test Failed",
      message: error instanceof Error ? error.message : "Unknown error",
      data: {}
    });
  }
};