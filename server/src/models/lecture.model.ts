import mongoose, { Document } from "mongoose";

export interface ILecture {
  title: string;
  videoUrl: string;
  publicId: string;
  isPreview: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILectureDocument extends ILecture, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model<ILectureDocument>(
  "Lecture",
  lectureSchema
);
