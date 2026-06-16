import { Badge } from "@/components/ui/Badge";
import type { TaskPriority } from "@/types";

const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  High: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge className={PRIORITY_CLASSES[priority]}>{priority}</Badge>;
}
