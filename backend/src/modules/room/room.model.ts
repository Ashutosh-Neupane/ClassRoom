import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  capacity: number;
}

const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true, default: 20 }
});

export const Room = mongoose.model<IRoom>("Room", RoomSchema);