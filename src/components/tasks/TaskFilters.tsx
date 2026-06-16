"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { TaskFilters as TaskFiltersValue } from "@/types";

interface TaskFiltersProps {
  filters: TaskFiltersValue;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onChange: (partial: Partial<TaskFiltersValue>) => void;
}

export function TaskFilters({ filters, searchInput, onSearchChange, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex-1">
        <Input
          name="search"
          placeholder="Search tasks by title..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <Select
        name="priority"
        value={filters.priority}
        onChange={(e) => onChange({ priority: e.target.value as TaskFiltersValue["priority"], page: 1 })}
        aria-label="Filter by priority"
        className="sm:w-40"
      >
        <option value="">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </Select>

      <Select
        name="status"
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value as TaskFiltersValue["status"], page: 1 })}
        aria-label="Filter by status"
        className="sm:w-40"
      >
        <option value="">All statuses</option>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </Select>

      <Select
        name="sort"
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value as TaskFiltersValue["sort"], page: 1 })}
        aria-label="Sort tasks"
        className="sm:w-40"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="dueDate">Due date</option>
      </Select>
    </div>
  );
}
