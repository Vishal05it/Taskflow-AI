import type { ApiResponse } from "@/types";

export class ApiRequestError extends Error {
  fieldErrors?: Record<string, string>;
  status: number;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Thin wrapper around fetch for talking to our own /api routes with consistent error handling. */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const json: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: "Unexpected server response",
  }));

  if (!json.success) {
    throw new ApiRequestError(json.error, response.status, json.fieldErrors);
  }

  return json.data;
}
