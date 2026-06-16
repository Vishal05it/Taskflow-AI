import { NextRequest } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { aiSuggestSchema, flattenZodErrors } from "@/lib/validators";
import { generateTaskDescription } from "@/lib/aiService";
import { success, ApiErrors } from "@/lib/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    const body = await request.json();
    const parsed = aiSuggestSchema.safeParse(body);
    if (!parsed.success) {
      return ApiErrors.validation(flattenZodErrors(parsed.error));
    }

    const result = await generateTaskDescription(parsed.data.title);
    return success(result);
  } catch (error) {
    console.error("AI suggest description error:", error);
    return ApiErrors.serverError();
  }
}
