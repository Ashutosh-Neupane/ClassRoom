import { Request, Response, NextFunction } from "express";
import { createScheduleSchema, updateScheduleSchema } from "./schedule.validation";
import { createScheduleService, getCalendarSchedulesService, updateScheduleService, deleteScheduleService, getAllSchedulesService } from "./schedule.service";
import { Instructor } from "../instructor/instructor.model";
import { Room } from "../room/room.model";
import { sendSuccess, sendError } from "../../utils/apiResponse";
import { parsePagination, createPaginationResult } from "../../middlewares/pagination";
import { ZodError } from "zod";

export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = createScheduleSchema.parse(req.body);
    
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
    if (err instanceof ZodError) {
      return sendError(res, 400, {
        title: "Validation Error",
        message: "Invalid schedule input",
        errors: err.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    next(err);
  }
};

export const getAllSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = parsePagination(req);
    const { schedules, total } = await getAllSchedulesService(page, limit);
    const pagination = createPaginationResult(total, page, limit);

    return sendSuccess(res, 200, {
      title: "Schedules Retrieved",
      message: "All schedules fetched successfully",
      data: schedules,
      pagination
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
    
    const updateData = { ...validated };
    if (req.file) {
      (updateData as any).attachment = req.file.path;
    }

    const result = await updateScheduleService(req.params.id as string, updateData);

    return sendSuccess(res, 200, {
      title: "Schedule Updated",
      message: "Class schedule updated successfully",
      data: result,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return sendError(res, 400, {
        title: "Validation Error",
        message: "Invalid update data",
        errors: err.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    next(err);
  }
};

export const deleteSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteScheduleService(req.params.id as string);

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

    const fromDate = (from || startDate) as string;
    const toDate = (to || endDate) as string;

    if (!fromDate || !toDate) {
      return sendError(res, 400, {
        title: "Missing Parameters",
        message: "startDate and endDate parameters are required",
        errors: [
          { field: "startDate", message: "Start date is required" },
          { field: "endDate", message: "End date is required" }
        ]
      });
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