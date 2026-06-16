import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/fetcher";
import type { TaskStats } from "@/types";

const EMPTY_STATS: TaskStats = { total: 0, completed: 0, inProgress: 0, pending: 0 };

export function useTaskStats(refreshKey: number) {
  const [stats, setStats] = useState<TaskStats>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await apiFetch<TaskStats>("/api/tasks/stats");
      setStats(result);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // refreshKey intentionally re-triggers the fetch after task mutations elsewhere on the page.
  }, [fetchStats, refreshKey]);

  return { stats, isLoading };
}
