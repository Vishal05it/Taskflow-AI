import bcrypt from "bcryptjs";

export const OTP_TTL_MS = 2 * 60 * 1000;

/** Generates a random 5-digit numeric OTP, e.g. "04839". */
export function generateOtp(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}
