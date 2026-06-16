import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/fetcher";
import type { PaginatedResult, TaskDTO, TaskFilters, TaskInput } from "@/types";

const DEFAULT_LIMIT = 9;

function buildQuery(filters: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.status) params.set("status", filters.status);
  params.set("sort", filters.sort);
  params.set("page", String(filters.page));
  params.set("limit", String(DEFAULT_LIMIT));
  return params.toString();
}

interface UseTasksResult {
  tasks: TaskDTO[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createTask: (input: TaskInput) => Promise<TaskDTO>;
  updateTask: (id: string, input: Partial<TaskInput>) => Promise<TaskDTO>;
  deleteTask: (id: string) => Promise<void>;
}

export function useTasks(filters: TaskFilters): UseTasksResult {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = buildQuery(filters);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFetch<PaginatedResult<TaskDTO>>(`/api/tasks?${query}`);
      setTasks(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (input: TaskInput) => {
      const task = await apiFetch<TaskDTO>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(input),
      });
      await fetchTasks();
      return task;
    },
    [fetchTasks]
  );

  const updateTask = useCallback(
    async (id: string, input: Partial<TaskInput>) => {
      const task = await apiFetch<TaskDTO>(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      });
      await fetchTasks();
      return task;
    },
    [fetchTasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      await fetchTasks();
    },
    [fetchTasks]
  );

  return {
    tasks,
    total,
    totalPages,
    isLoading,
    error,
    refresh: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
