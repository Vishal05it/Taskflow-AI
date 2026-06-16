import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { getCurrentUserId } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { serializeUser } from "@/lib/serializers";
import type { UserDTO } from "@/types";

export const metadata: Metadata = {
  title: "TaskFlow AI — Mini SaaS Task Manager",
  description: "Plan, track, and complete your work with TaskFlow AI.",
};

async function getInitialUser(): Promise<UserDTO | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    await connectToDatabase();
    const user = await User.findById(userId);
    return user ? serializeUser(user) : null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialUser = await getInitialUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers initialUser={initialUser}>{children}</Providers>
      </body>
    </html>
  );
}
