import mongoose, { Schema, Document } from "mongoose";

export interface IInstructor extends Document {
  name: string;
}

const InstructorSchema: Schema = new Schema({
  name: { type: String, required: true }
});

export const Instructor = mongoose.model<IInstructor>("Instructor", InstructorSchema);