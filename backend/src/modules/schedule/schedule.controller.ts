import { Request, Response, NextFunction } from "express";
import { createScheduleSchema, updateScheduleSchema } from "./schedule.validation";
import { createScheduleService, getCalendarSchedulesService, updateScheduleService, deleteScheduleService } from "./schedule.service";
import { sendSuccess } from "../../utils/apiResponse";

export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = createScheduleSchema.parse(req.body);

    const result = await createScheduleService(validated);

    return sendSuccess(res, 201, {
      title: "Schedule Created",
      message: "Class schedule created successfully",
      data: result,
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

    const result = await updateScheduleService(req.params.id, validated);

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
    const { from, to } = req.query;

    if (!from || !to) {
      throw new Error("from and to dates are required");
    }

    const events = await getCalendarSchedulesService(
      new Date(from as string),
      new Date(to as string)
    );

    return sendSuccess(res, 200, {
      title: "Classes fetched",
      message: "Class list loaded",
      data: events,
    });
  } catch (err) {
    next(err);
  }
};