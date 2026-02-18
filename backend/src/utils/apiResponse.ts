import { Response } from "express";
import { SuccessResponse, ErrorResponse } from "../types/api.types";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  payload: SuccessResponse<T>
) => {
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  payload: ErrorResponse
) => {
  return res.status(statusCode).json(payload);
};