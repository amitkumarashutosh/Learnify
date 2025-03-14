import mongoose, { Schema, Document } from "mongoose";

export interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  payload: string;
  createdAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    payload: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires after 5 min
  },
  { timestamps: true }
);

export const Challenge = mongoose.model<IChallenge>(
  "Challenge",
  ChallengeSchema
);
