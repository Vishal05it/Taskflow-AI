import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUserId } from "@/lib/auth";
import { updateProfileSchema, flattenZodErrors } from "@/lib/validators";
import { serializeUser } from "@/lib/serializers";
import { success, ApiErrors } from "@/lib/apiResponse";

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return ApiErrors.validation(flattenZodErrors(parsed.error));
    }

    const { name, email } = parsed.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return ApiErrors.validation({ email: "An account with this email already exists" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return ApiErrors.notFound("User");
    }

    return success(serializeUser(user));
  } catch (error) {
    console.error("Update profile error:", error);
    return ApiErrors.serverError();
  }
}
