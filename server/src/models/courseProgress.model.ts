import mongoose from "mongoose";

interface ILectureProgress {
  lectureId: string;
  viewed: boolean;
}

interface ICourseProgress {
  courseId: string;
  userId: string;
  completed: boolean;
  lectureProgress: ILectureProgress[];
}

const lectureProgressSchema = new mongoose.Schema({
  lectureId: { type: String },
  viewed: { type: Boolean },
});

const courseProgressSchema = new mongoose.Schema({
  courseId: { type: String },
  userId: { type: String },
  completed: { type: Boolean },
  lectureProgress: [lectureProgressSchema],
});

export const CourseProgress = mongoose.model<ICourseProgress>(
  "CourseProgress",
  courseProgressSchema
);
