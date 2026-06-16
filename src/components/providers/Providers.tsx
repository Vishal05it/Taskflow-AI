"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { ToastProvider } from "./ToastProvider";
import type { UserDTO } from "@/types";

export function Providers({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: UserDTO | null;
}) {
  return (
    <ThemeProvider>
      <AuthProvider initialUser={initialUser}>
        {children}
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}
