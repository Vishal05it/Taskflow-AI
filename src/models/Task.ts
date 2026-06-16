import { Schema, model, models, Types, type Document, type Model } from "mongoose";
import type { TaskPriority, TaskStatus } from "@/types";

export interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed"],
      default: "Todo",
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Supports the dashboard's default "newest first" listing and per-user filtering.
taskSchema.index({ userId: 1, createdAt: -1 });
// Speeds up title search within a user's own tasks.
taskSchema.index({ userId: 1, title: 1 });

export const Task: Model<ITask> = models.Task || model<ITask>("Task", taskSchema);
