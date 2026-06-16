import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function success<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function failure(
  error: string,
  status = 400,
  fieldErrors?: Record<string, string>
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    { success: false, error, ...(fieldErrors ? { fieldErrors } : {}) },
    { status }
  );
}

export const ApiErrors = {
  unauthorized: () => failure("You must be logged in to do this", 401),
  notFound: (resource = "Resource") => failure(`${resource} not found`, 404),
  serverError: () => failure("Something went wrong. Please try again.", 500),
  validation: (fieldErrors: Record<string, string>) =>
    failure("Please fix the highlighted fields", 422, fieldErrors),
};
