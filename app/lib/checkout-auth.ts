import { auth } from "@/auth";
import { USER_ID_COOKIE } from "@/app/lib/auth-constants";
import { ensureValidAccessToken, resolveUserId } from "@/app/lib/auth-tokens";
import { cookies } from "next/headers";

export type CheckoutAuth = {
  authorized: boolean;
  customerEmail?: string;
  userId?: string;
};

/** Matches cart API auth: NextAuth session or valid backend token cookies. */
export async function getCheckoutAuth(): Promise<CheckoutAuth> {
  const session = await auth();
  const userId = await resolveUserId();

  if (session?.user) {
    return {
      authorized: true,
      customerEmail: session.user.email ?? undefined,
      userId,
    };
  }

  const cookieStore = await cookies();
  const cookieUserId = cookieStore.get(USER_ID_COOKIE)?.value;
  const hasToken = await ensureValidAccessToken();

  if (hasToken && (userId || cookieUserId)) {
    return { authorized: true, userId: userId ?? cookieUserId };
  }

  return { authorized: false };
}
