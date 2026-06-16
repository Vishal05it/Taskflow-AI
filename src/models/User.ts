import { Schema, model, models, type Document, type Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  resetOtpHash: string | null;
  resetOtpExpiresAt: Date | null;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: 80,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  resetOtpHash: {
    type: String,
    default: null,
    select: false,
  },
  resetOtpExpiresAt: {
    type: Date,
    default: null,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User: Model<IUser> = models.User || model<IUser>("User", userSchema);
