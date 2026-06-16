import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const taskPriorityEnum = z.enum(["Low", "Medium", "High"]);
export const taskStatusEnum = z.enum(["Todo", "In Progress", "Completed"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(5000).optional().default(""),
  priority: taskPriorityEnum.optional().default("Medium"),
  status: taskStatusEnum.optional().default("Todo"),
  dueDate: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((val) => !val || !Number.isNaN(Date.parse(val)), {
      message: "Enter a valid date",
    }),
});

export const updateTaskSchema = createTaskSchema.partial();

export const aiSuggestSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  otp: z
    .string()
    .trim()
    .length(5, "Enter the 5-digit code")
    .regex(/^\d{5}$/, "Code must be 5 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

/** Flattens the first zod issue per field into a simple { field: message } map for API responses. */
export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
