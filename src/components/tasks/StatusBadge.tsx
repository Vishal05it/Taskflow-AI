import { Badge } from "@/components/ui/Badge";
import type { TaskStatus } from "@/types";

const STATUS_CLASSES: Record<TaskStatus, string> = {
  Todo: "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300",
  "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge className={STATUS_CLASSES[status]}>{status}</Badge>;
}
