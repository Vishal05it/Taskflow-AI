import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Task } from "@/models/Task";
import { getCurrentUserId } from "@/lib/auth";
import { createTaskSchema, flattenZodErrors } from "@/lib/validators";
import { serializeTask } from "@/lib/serializers";
import { success, ApiErrors } from "@/lib/apiResponse";
import type { PaginatedResult, SortOption, TaskDTO } from "@/types";

const SORT_MAP: Record<SortOption, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  dueDate: { dueDate: 1 },
};

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const priority = searchParams.get("priority") ?? "";
    const status = searchParams.get("status") ?? "";
    const sort = (searchParams.get("sort") as SortOption) || "newest";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 9));

    const filter: Record<string, unknown> = { userId };
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (priority && ["Low", "Medium", "High"].includes(priority)) {
      filter.priority = priority;
    }
    if (status && ["Todo", "In Progress", "Completed"].includes(status)) {
      filter.status = status;
    }

    const sortSpec = SORT_MAP[sort] || SORT_MAP.newest;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sortSpec)
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    const result: PaginatedResult<TaskDTO> = {
      items: tasks.map(serializeTask),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return success(result);
  } catch (error) {
    console.error("List tasks error:", error);
    return ApiErrors.serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return ApiErrors.validation(flattenZodErrors(parsed.error));
    }

    await connectToDatabase();

    const { title, description, priority, status, dueDate } = parsed.data;
    const task = await Task.create({
      userId,
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return success(serializeTask(task), 201);
  } catch (error) {
    console.error("Create task error:", error);
    return ApiErrors.serverError();
  }
}
