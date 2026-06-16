"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#1e293b",
          color: "#f8fafc",
          fontSize: "0.875rem",
        },
        success: { iconTheme: { primary: "#22c55e", secondary: "#f8fafc" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#f8fafc" } },
      }}
    />
  );
}
