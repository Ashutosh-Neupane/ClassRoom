import { ZodError } from "zod";
import mongoose from "mongoose";

export interface MongooseDuplicateError extends Error {
  code: 11000;
  keyPattern: Record<string, number>;
  keyValue: Record<string, any>;
}

export type AppError = 
  | ZodError
  | mongoose.Error.ValidationError
  | mongoose.Error.CastError
  | MongooseDuplicateError
  | Error;