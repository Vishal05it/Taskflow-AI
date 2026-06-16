"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateTime } from "@/lib/dateUtils";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your profile</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        View your account details below.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {user.name}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Member since
            </dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {formatDateTime(user.createdAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <Link
            href="/dashboard/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
}
