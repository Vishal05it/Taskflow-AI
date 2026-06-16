import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword, signToken, getAuthCookieOptions, AUTH_COOKIE_NAME } from "@/lib/auth";
import { registerSchema, flattenZodErrors } from "@/lib/validators";
import { serializeUser } from "@/lib/serializers";
import { success, ApiErrors } from "@/lib/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return ApiErrors.validation(flattenZodErrors(parsed.error));
    }

    const { name, email, password } = parsed.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiErrors.validation({ email: "An account with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = signToken({ userId: user._id.toString() });
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, await getAuthCookieOptions());

    return success(serializeUser(user), 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiErrors.validation(flattenZodErrors(error));
    }
    console.error("Register error:", error);
    return ApiErrors.serverError();
  }
}
