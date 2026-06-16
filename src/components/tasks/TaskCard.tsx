"use client";

import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { Select } from "@/components/ui/Select";
import { formatDate, formatDateTime, isOverdue } from "@/lib/dateUtils";
import { cn } from "@/lib/cn";
import type { TaskDTO, TaskStatus } from "@/types";

interface TaskCardProps {
  task: TaskDTO;
  onEdit: (task: TaskDTO) => void;
  onDelete: (task: TaskDTO) => void;
  onStatusChange: (task: TaskDTO, status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {task.title}
        </h3>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-9.5 9.5a1 1 0 0 1-.45.263l-3.5 1a1 1 0 0 1-1.236-1.236l1-3.5a1 1 0 0 1 .263-.45l9.5-9.5Z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task)}
            aria-label="Delete task"
            className="rounded-full p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.808a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        {overdue && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">
            Overdue
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span title={formatDateTime(task.createdAt)}>Created {formatDate(task.createdAt)}</span>
        <span className={cn(overdue && "font-medium text-red-500")}>
          Due {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <Select
          name={`status-${task.id}`}
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
          aria-label="Update task status"
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>
      </div>
    </div>
  );
}
