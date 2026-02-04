import { Request, Response, NextFunction } from "express";
import { createScheduleSchema } from "./schedule.validation";
import { createScheduleService } from "./schedule.service";
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