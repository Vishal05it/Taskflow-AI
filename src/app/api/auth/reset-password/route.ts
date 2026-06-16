import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { resetPasswordSchema, flattenZodErrors } from "@/lib/validators";
import { verifyOtp } from "@/lib/otp";
import { hashPassword } from "@/lib/auth";
import { success, failure, ApiErrors } from "@/lib/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return ApiErrors.validation(flattenZodErrors(parsed.error));
    }

    const { email, otp, newPassword } = parsed.data;

    await connectToDatabase();
    const user = await User.findOne({ email }).select("+resetOtpHash +resetOtpExpiresAt");

    if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt) {
      return failure("Invalid OTP", 400);
    }

    if (user.resetOtpExpiresAt.getTime() < Date.now()) {
      user.resetOtpHash = null;
      user.resetOtpExpiresAt = null;
      await user.save();
      return failure("This code has expired. Please request a new one.", 400);
    }

    const isOtpValid = await verifyOtp(otp, user.resetOtpHash);
    if (!isOtpValid) {
      return failure("Invalid OTP", 400);
    }

    user.password = await hashPassword(newPassword);
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;
    await user.save();

    return success({ message: "Password updated. You can now sign in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return ApiErrors.serverError();
  }
}
