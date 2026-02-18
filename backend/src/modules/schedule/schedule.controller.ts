import { Request, Response, NextFunction } from "express";
import { createScheduleSchema, updateScheduleSchema } from "./schedule.validation";
import { createScheduleService, getCalendarSchedulesService, updateScheduleService, deleteScheduleService, getAllSchedulesService } from "./schedule.service";
import { Instructor } from "../instructor/instructor.model";
import { Room } from "../room/room.model";
import { sendSuccess } from "../../utils/apiResponse";

export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = createScheduleSchema.parse(req.body);
    
    // Add file path if uploaded
    const scheduleData = { ...validated };
    if (req.file) {
      (scheduleData as any).attachment = req.file.path;
    }

    const result = await createScheduleService(scheduleData);

    return sendSuccess(res, 201, {
      title: "Schedule Created",
      message: "Class schedule created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schedules = await getAllSchedulesService();

    return sendSuccess(res, 200, {
      title: "Schedules Retrieved",
      message: "All schedules fetched successfully",
      data: schedules,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = updateScheduleSchema.parse(req.body);
    
    // Add file path if uploaded
    const updateData = { ...validated };
    if (req.file) {
      (updateData as any).attachment = req.file.path;
    }

    const result = await updateScheduleService(req.params.id, updateData);

    return sendSuccess(res, 200, {
      title: "Schedule Updated",
      message: "Class schedule updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteScheduleService(req.params.id);

    return sendSuccess(res, 200, {
      title: "Schedule Deleted",
      message: "Class schedule deleted successfully",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

export const getCalendarSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, to, startDate, endDate } = req.query;

    // Accept both parameter naming conventions
    const fromDate = from || startDate;
    const toDate = to || endDate;

    if (!fromDate || !toDate) {
      throw new Error("startDate and endDate parameters are required");
    }

    const events = await getCalendarSchedulesService(
      new Date(fromDate as string),
      new Date(toDate as string)
    );

    return sendSuccess(res, 200, {
      title: "Calendar Events",
      message: "Calendar events fetched successfully",
      data: events,
    });
  } catch (err) {
    next(err);
  }
};

export const getInstructors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const instructors = await Instructor.find().select('_id name email specialization');

    return sendSuccess(res, 200, {
      title: "Instructors Retrieved",
      message: "All instructors fetched successfully",
      data: instructors,
    });
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rooms = await Room.find().select('_id name capacity equipment');

    return sendSuccess(res, 200, {
      title: "Rooms Retrieved",
      message: "All rooms fetched successfully",
      data: rooms,
    });
  } catch (err) {
    next(err);
  }
};