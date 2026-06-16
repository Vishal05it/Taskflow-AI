import type { TaskStats } from "@/types";
import { cn } from "@/lib/cn";

interface StatCardConfig {
  key: keyof TaskStats;
  label: string;
  accentClass: string;
}

const CARDS: StatCardConfig[] = [
  { key: "total", label: "Total Tasks", accentClass: "text-slate-900 dark:text-slate-100" },
  { key: "completed", label: "Completed", accentClass: "text-emerald-600 dark:text-emerald-400" },
  { key: "inProgress", label: "In Progress", accentClass: "text-blue-600 dark:text-blue-400" },
  { key: "pending", label: "Pending", accentClass: "text-amber-600 dark:text-amber-400" },
];

export function StatsCards({ stats, isLoading }: { stats: TaskStats; isLoading: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
          <p
            className={cn(
              "mt-2 text-3xl font-bold",
              card.accentClass,
              isLoading && "opacity-40"
            )}
          >
            {stats[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
