import mongoose from "mongoose";

export interface IPurchaseCourse {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "success" | "failed";
  paymentId: string;
}

export interface IPurchaseCourseDocument extends IPurchaseCourse, Document {
  createdAt: Date;
  updatedAt: Date;
}

const purchaseCourseSchema = new mongoose.Schema<IPurchaseCourseDocument>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paymentId: { type: String },
  },
  { timestamps: true }
);

export const PurchaseCourse = mongoose.model<IPurchaseCourseDocument>(
  "PurchaseCourse",
  purchaseCourseSchema
);
