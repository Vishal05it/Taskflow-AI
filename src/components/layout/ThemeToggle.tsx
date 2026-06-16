"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 4.5a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v1.25a1 1 0 1 1-2 0V4.5Zm6.01 2.49a1 1 0 0 1 1.41 0l.01.01a1 1 0 0 1 0 1.41l-.89.89a1 1 0 1 1-1.42-1.41l.89-.9ZM19.5 12a1 1 0 0 1 1-1h0a1 1 0 0 1 0 2h0a1 1 0 0 1-1-1Zm-1.07 5.59.89.89a1 1 0 1 1-1.41 1.42l-.9-.89a1 1 0 0 1 1.42-1.42ZM12 18.25a1 1 0 0 1 1 1V20.5a1 1 0 1 1-2 0v-1.25a1 1 0 0 1 1-1Zm-6.01-1.07.9.89a1 1 0 0 1-1.42 1.42l-.89-.9a1 1 0 0 1 1.41-1.41ZM3.5 12a1 1 0 0 1 1-1h0a1 1 0 1 1 0 2h0a1 1 0 0 1-1-1Zm2.41-6.59a1 1 0 0 1 1.42 0l.89.9A1 1 0 0 1 6.81 7.7l-.89-.89a1 1 0 0 1 0-1.4ZM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.14 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 13.69 13 1 1 0 0 0-.05-2.36Z" />
        </svg>
      )}
    </button>
  );
}
