import {
  ACCESS_EXPIRES_COOKIE,
  ACCESS_TOKEN_COOKIE,
  isAccessTokenExpired,
} from "@/app/lib/auth-constants";
import { cookies } from "next/headers";

/** Authenticated catalog only when a non-expired backend access token is already present. */
export async function getCatalogAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const expiresAt = cookieStore.get(ACCESS_EXPIRES_COOKIE)?.value;
  return !!(accessToken && !isAccessTokenExpired(expiresAt));
}
