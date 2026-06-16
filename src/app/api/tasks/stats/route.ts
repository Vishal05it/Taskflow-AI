import { connectToDatabase } from "@/lib/db";
import { Task } from "@/models/Task";
import { getCurrentUserId } from "@/lib/auth";
import { success, ApiErrors } from "@/lib/apiResponse";
import type { TaskStats } from "@/types";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    await connectToDatabase();

    const [total, completed, inProgress, pending] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: "Completed" }),
      Task.countDocuments({ userId, status: "In Progress" }),
      Task.countDocuments({ userId, status: "Todo" }),
    ]);

    const stats: TaskStats = { total, completed, inProgress, pending };
    return success(stats);
  } catch (error) {
    console.error("Task stats error:", error);
    return ApiErrors.serverError();
  }
}
