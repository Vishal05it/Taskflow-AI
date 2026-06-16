"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="text-lg font-bold text-brand-600">
          TaskFlow AI
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">
              {user.name}
            </span>
          )}
          <Button variant="secondary" size="sm" onClick={handleLogout} isLoading={isLoggingOut}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
