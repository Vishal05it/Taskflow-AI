import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPassword, signToken, getAuthCookieOptions, AUTH_COOKIE_NAME } from "@/lib/auth";
import { loginSchema, flattenZodErrors } from "@/lib/validators";
import { serializeUser } from "@/lib/serializers";
import { success, failure, ApiErrors } from "@/lib/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return ApiErrors.validation(flattenZodErrors(parsed.error));
    }

    const { email, password } = parsed.data;

    await connectToDatabase();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return failure("Invalid email or password", 401);
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return failure("Invalid email or password", 401);
    }

    const token = signToken({ userId: user._id.toString() });
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, await getAuthCookieOptions());

    return success(serializeUser(user));
  } catch (error) {
    console.error("Login error:", error);
    return ApiErrors.serverError();
  }
}
