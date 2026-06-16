import { TaskCard } from "@/components/tasks/TaskCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import type { TaskDTO, TaskStatus } from "@/types";

interface TaskListProps {
  tasks: TaskDTO[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onCreate: () => void;
  onEdit: (task: TaskDTO) => void;
  onDelete: (task: TaskDTO) => void;
  onStatusChange: (task: TaskDTO, status: TaskStatus) => void;
}

export function TaskList({
  tasks,
  isLoading,
  hasActiveFilters,
  onCreate,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters ? "No tasks match your filters" : "No tasks yet"}
        description={
          hasActiveFilters
            ? "Try adjusting your search or filters to find what you're looking for."
            : "Create your first task to start tracking your work."
        }
        action={!hasActiveFilters && <Button onClick={onCreate}>Create a task</Button>}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
