import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  youtubeUrl: string;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Video = mongoose.model<IVideo>("Video", VideoSchema);
