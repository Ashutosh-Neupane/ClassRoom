import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";

export const simpleRecurrenceTest = (req: Request, res: Response) => {
  sendSuccess(res, 200, {
    title: "Simple Test",
    message: "Route is working",
    data: { test: "success" }
  });
};