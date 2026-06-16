"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { TaskDTO } from "@/types";

interface DeleteConfirmModalProps {
  task: TaskDTO | null;
  onClose: () => void;
  onConfirm: (task: TaskDTO) => Promise<void>;
}

export function DeleteConfirmModal({ task, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    if (!task) return;
    setIsDeleting(true);
    try {
      await onConfirm(task);
      toast.success("Task deleted");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete task");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal isOpen={!!task} onClose={onClose} title="Delete task">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Are you sure you want to delete <span className="font-semibold">{task?.title}</span>?
        This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} isLoading={isDeleting}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
