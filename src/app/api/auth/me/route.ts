import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUserId } from "@/lib/auth";
import { serializeUser } from "@/lib/serializers";
import { success, ApiErrors } from "@/lib/apiResponse";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return ApiErrors.unauthorized();
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return ApiErrors.unauthorized();
    }

    return success(serializeUser(user));
  } catch (error) {
    console.error("Get current user error:", error);
    return ApiErrors.serverError();
  }
}
