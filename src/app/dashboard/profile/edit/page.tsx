"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch, ApiRequestError } from "@/lib/fetcher";
import { updateProfileSchema, flattenZodErrors } from "@/lib/validators";
import type { UserDTO } from "@/types";

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = updateProfileSchema.safeParse({ name, email });
    if (!parsed.success) {
      setErrors(flattenZodErrors(parsed.error));
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await apiFetch<UserDTO>("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
      });
      updateUser(updatedUser);
      toast.success("Profile updated");
      router.push("/dashboard/profile");
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

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit profile</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Update your name and email address.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <Input
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <div className="mt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard/profile")}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
