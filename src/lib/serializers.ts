import type { IUser } from "@/models/User";
import type { ITask } from "@/models/Task";
import type { UserDTO, TaskDTO } from "@/types";

export function serializeUser(user: IUser): UserDTO {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}

export function serializeTask(task: ITask): TaskDTO {
  return {
    id: task._id.toString(),
    userId: task.userId.toString(),
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
