"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiRequestError } from "@/lib/fetcher";
import {
  forgotPasswordRequestSchema,
  resetPasswordSchema,
  flattenZodErrors,
} from "@/lib/validators";

type Step = "request" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequestOtp(event: FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = forgotPasswordRequestSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      toast.success("If an account exists for this email, a code has been sent.");
      setStep("reset");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.fieldErrors ?? {});
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event: FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = resetPasswordSchema.safeParse({ email, otp, newPassword });
    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      toast.success("Password updated. Please sign in.");
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.message === "Invalid OTP") {
          toast.error("Invalid OTP");
        } else {
          toast.error(error.message);
        }
        setErrors(error.fieldErrors ?? {});
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
        Forgot password
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        {step === "request"
          ? "Enter your email and we'll send you a 5-digit reset code."
          : "Enter the 5-digit code we sent you and choose a new password."}
      </p>

      {step === "request" ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Send code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <Input
            label="5-digit code"
            name="otp"
            inputMode="numeric"
            maxLength={5}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            error={errors.otp}
            placeholder="12345"
          />
          <Input
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            placeholder="At least 6 characters"
          />
          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Reset password
          </Button>
          <button
            type="button"
            onClick={() => setStep("request")}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
