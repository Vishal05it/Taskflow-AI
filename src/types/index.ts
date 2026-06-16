export type TaskPriority = "Low" | "Medium" | "High";

export type TaskStatus = "Todo" | "In Progress" | "Completed";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface TaskDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type SortOption = "newest" | "oldest" | "dueDate";

export interface TaskFilters {
  search: string;
  priority: TaskPriority | "";
  status: TaskStatus | "";
  sort: SortOption;
  page: number;
}

export interface TaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
