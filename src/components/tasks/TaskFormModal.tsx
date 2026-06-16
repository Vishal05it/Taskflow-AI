"use client";

import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { createTaskSchema, flattenZodErrors } from "@/lib/validators";
import { toDateInputValue } from "@/lib/dateUtils";
import { apiFetch, ApiRequestError } from "@/lib/fetcher";
import type { AiDescriptionResult } from "@/lib/aiService";
import type { TaskDTO, TaskInput, TaskPriority, TaskStatus } from "@/types";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskDTO | null;
  onSubmit: (input: TaskInput) => Promise<void>;
}

interface TaskFormState {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

const EMPTY_FORM: TaskFormState = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Todo",
  dueDate: "",
};

export function TaskFormModal({
  isOpen,
  onClose,
  task,
  onSubmit,
}: TaskFormModalProps) {
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: toDateInputValue(task.dueDate),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [isOpen, task]);

  async function handleSuggestDescription() {
    if (!form.title.trim()) {
      setErrors((prev) => ({
        ...prev,
        title: "Enter a title first to get an AI suggestion",
      }));
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await apiFetch<AiDescriptionResult>(
        "/api/ai/suggest-description",
        {
          method: "POST",
          body: JSON.stringify({ title: form.title }),
        },
      );
      setForm((prev) => ({ ...prev, description: result.description }));
      toast.success(
        result.source === "openai"
          ? "AI suggestion added"
          : "Suggestion added (placeholder mode)",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not generate a suggestion",
      );
    } finally {
      setIsSuggesting(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = createTaskSchema.safeParse({
      ...form,
      dueDate: form.dueDate || null,
    });

    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
      toast.success(task ? "Task updated" : "Task created");
      onClose();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.fieldErrors ?? {});
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit task" : "Create task"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          error={errors.title}
          placeholder="e.g. Write Q3 product roadmap"
        />

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
            </label>
            <button
              type="button"
              onClick={handleSuggestDescription}
              disabled={isSuggesting}
              className="text-xs font-medium text-brand-600 hover:underline disabled:opacity-50"
            >
              {isSuggesting ? "Generating..." : "✨ Suggest with AI"}
            </button>
          </div>
          <Textarea
            name="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            error={errors.description}
            rows={4}
            placeholder="What needs to be done?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                priority: e.target.value as typeof prev.priority,
              }))
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>

          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as typeof prev.status,
              }))
            }
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>

        <Input
          label="Due date"
          name="dueDate"
          type="date"
          className="dark:text-white"
          value={form.dueDate}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, dueDate: e.target.value }))
          }
          error={errors.dueDate}
        />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {task ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
