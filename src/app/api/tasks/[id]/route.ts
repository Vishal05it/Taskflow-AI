import { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Task } from "@/models/Task";
import { getCurrentUserId } from "@/lib/auth";
import { updateTaskSchema, flattenZodErrors } from "@/lib/validators";
import { serializeTask } from "@/lib/serializers";
import { success, failure, ApiErrors } from "@/lib/apiResponse";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return ApiErrors.notFound("Task");
    }

    await connectToDatabase();
    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return ApiErrors.notFound("Task");
    }

    return success(serializeTask(task));
  } catch (error) {
    console.error("Get task error:", error);
    return ApiErrors.serverError();
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return ApiErrors.notFound("Task");
    }

    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return ApiErrors.validation(flattenZodErrors(parsed.error));
    }

    if (Object.keys(parsed.data).length === 0) {
      return failure("No fields provided to update", 400);
    }

    await connectToDatabase();

    const { dueDate, ...rest } = parsed.data;
    const update: Record<string, unknown> = { ...rest };
    if (dueDate !== undefined) {
      update.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const task = await Task.findOneAndUpdate({ _id: id, userId }, update, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return ApiErrors.notFound("Task");
    }

    return success(serializeTask(task));
  } catch (error) {
    console.error("Update task error:", error);
    return ApiErrors.serverError();
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return ApiErrors.notFound("Task");
    }

    await connectToDatabase();
    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      return ApiErrors.notFound("Task");
    }

    return success({ deleted: true });
  } catch (error) {
    console.error("Delete task error:", error);
    return ApiErrors.serverError();
  }
}
