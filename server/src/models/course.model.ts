import mongoose from "mongoose";

interface ICourse {
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advance";
  price: number;
  thumbnail: string;
  enrolledStudents?: mongoose.Types.ObjectId[];
  lectures: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  isPublished: boolean;
}

interface ICourseDocument extends ICourse, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new mongoose.Schema<ICourseDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    category: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advance"],
      default: "Beginner",
    },
    price: { type: Number, required: true, default: 99 },
    thumbnail: {
      type: String,
      default:
        "https://blogassets.leverageedu.com/blog/wp-content/uploads/2020/02/11185533/B-Tech-Courses.jpg",
    },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lectures: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Lecture",
      default: [],
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourseDocument>("Course", courseSchema);
