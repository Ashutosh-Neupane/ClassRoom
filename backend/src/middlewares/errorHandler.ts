import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { sendError } from "../utils/apiResponse";
import { AppError, MongooseDuplicateError } from "../types/error.types";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation error
  if (err instanceof ZodError) {
    return sendError(res, 400, {
      title: "Validation Error",
      message: "Invalid input data",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return sendError(res, 400, {
      title: "Validation Error",
      message: "Database validation failed",
      errors,
    });
  }

  // Mongoose duplicate key error
  if ('code' in err && err.code === 11000) {
    const duplicateError = err as MongooseDuplicateError;
    return sendError(res, 400, {
      title: "Duplicate Error",
      message: "Duplicate field value",
    });
  }

  // Default server error
  return sendError(res, 500, {
    title: "Server Error",
    message: err.message || "Something went wrong",
  });
};