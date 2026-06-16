import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { forgotPasswordRequestSchema, flattenZodErrors } from "@/lib/validators";
import { generateOtp, hashOtp, OTP_TTL_MS } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";
import { success, ApiErrors } from "@/lib/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordRequestSchema.safeParse(body);
    if (!parsed.success) {
      return ApiErrors.validation(flattenZodErrors(parsed.error));
    }

    const { email } = parsed.data;

    await connectToDatabase();
    const user = await User.findOne({ email });

    // Always respond with the same generic message so we don't leak which emails have accounts.
    if (user) {
      const otp = generateOtp();
      user.resetOtpHash = await hashOtp(otp);
      user.resetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
      await user.save();

      await sendOtpEmail(user.email, otp);
    }

    return success({ message: "If an account exists for this email, a code has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return ApiErrors.serverError();
  }
}
