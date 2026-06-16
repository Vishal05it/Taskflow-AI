import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { success } from "@/lib/apiResponse";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  return success({ loggedOut: true });
}
