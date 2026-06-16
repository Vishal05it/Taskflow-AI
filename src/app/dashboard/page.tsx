"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { useTasks } from "@/hooks/useTasks";
import { useTaskStats } from "@/hooks/useTaskStats";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAuth } from "@/components/providers/AuthProvider";
import type { TaskDTO, TaskFilters as TaskFiltersValue, TaskInput, TaskStatus } from "@/types";

const INITIAL_FILTERS: TaskFiltersValue = {
  search: "",
  priority: "",
  status: "",
  sort: "newest",
  page: 1,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<TaskFiltersValue>(INITIAL_FILTERS);
  const debouncedSearch = useDebouncedValue(searchInput);

  const activeFilters: TaskFiltersValue = { ...filters, search: debouncedSearch };
  const { tasks, totalPages, isLoading, createTask, updateTask, deleteTask } =
    useTasks(activeFilters);

  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const { stats, isLoading: isStatsLoading } = useTaskStats(statsRefreshKey);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDTO | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskDTO | null>(null);

  function refreshStats() {
    setStatsRefreshKey((key) => key + 1);
  }

  function handleOpenCreate() {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(task: TaskDTO) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  async function handleSubmitTask(input: TaskInput) {
    if (editingTask) {
      await updateTask(editingTask.id, input);
    } else {
      await createTask(input);
    }
    refreshStats();
  }

  async function handleStatusChange(task: TaskDTO, status: TaskStatus) {
    try {
      await updateTask(task.id, { status });
      refreshStats();
      toast.success("Status updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update status");
    }
  }

  async function handleDeleteConfirmed(task: TaskDTO) {
    await deleteTask(task.id);
    refreshStats();
  }

  function handleFiltersChange(partial: Partial<TaskFiltersValue>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }

  const hasActiveFilters = Boolean(
    activeFilters.search || activeFilters.priority || activeFilters.status
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Here&apos;s what&apos;s happening with your tasks today.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="self-start sm:self-auto">
          + New Task
        </Button>
      </div>

      <StatsCards stats={stats} isLoading={isStatsLoading} />

      <div className="flex flex-col gap-4">
        <TaskFilters
          filters={filters}
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          onChange={handleFiltersChange}
        />

        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          onCreate={handleOpenCreate}
          onEdit={handleOpenEdit}
          onDelete={setDeletingTask}
          onStatusChange={handleStatusChange}
        />

        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      </div>

      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        task={editingTask}
        onSubmit={handleSubmitTask}
      />

      <DeleteConfirmModal
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
