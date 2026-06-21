import {
  ACCESS_EXPIRES_COOKIE,
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  isAccessTokenExpired,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  USER_ID_COOKIE,
} from "@/app/lib/auth-constants";
import { cookies } from "next/headers";

export {
  ACCESS_EXPIRES_COOKIE,
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  isAccessTokenExpired,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  USER_ID_COOKIE,
} from "@/app/lib/auth-constants";

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  userId?: string | number;
};

const COOKIE_MUTATION_ERROR =
  "Cookies can only be modified in a Server Action or Route Handler";

export async function setAuthCookies(tokens: TokenPair) {
  const cookieStore = await cookies();
  const expiresAt = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_MAX_AGE;
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: tokens.accessToken,
    httpOnly: true,
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    secure: isProd,
    sameSite: "lax",
  });

  cookieStore.set({
    name: REFRESH_TOKEN_COOKIE,
    value: tokens.refreshToken,
    httpOnly: true,
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    secure: isProd,
    sameSite: "lax",
  });

  cookieStore.set({
    name: ACCESS_EXPIRES_COOKIE,
    value: expiresAt.toString(),
    httpOnly: true,
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    secure: isProd,
    sameSite: "lax",
  });

  if (tokens.userId !== undefined) {
    cookieStore.set({
      name: USER_ID_COOKIE,
      value: String(tokens.userId),
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

/** Persist tokens when allowed; silently skip in Server Components. */
export async function trySetAuthCookies(tokens: TokenPair): Promise<boolean> {
  try {
    await setAuthCookies(tokens);
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(COOKIE_MUTATION_ERROR)
    ) {
      return false;
    }
    throw error;
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  const cookieNames = [
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    ACCESS_EXPIRES_COOKIE,
    USER_ID_COOKIE,
  ];

  const isProd = process.env.NODE_ENV === "production";

  for (const name of cookieNames) {
    cookieStore.set({
      name,
      value: "",
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
    });
  }
}

export async function fetchTokenRefresh(
  refreshToken: string,
): Promise<TokenPair | null> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as TokenPair;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

export async function refreshTokens(): Promise<boolean> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return false;
  }

  const tokens = await fetchTokenRefresh(refreshToken);
  if (!tokens) {
    return false;
  }

  await trySetAuthCookies({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    userId: tokens.userId,
  });
  return true;
}

/**
 * Returns a valid access token for backend API calls.
 * Refreshes in-memory when expired; persists cookies only in Route Handlers / Server Actions.
 */
export async function resolveAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const expiresAt = cookieStore.get(ACCESS_EXPIRES_COOKIE)?.value;

  if (accessToken && !isAccessTokenExpired(expiresAt)) {
    return accessToken;
  }

  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return undefined;
  }

  const tokens = await fetchTokenRefresh(refreshToken);
  if (!tokens) {
    return undefined;
  }

  await trySetAuthCookies({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    userId: tokens.userId,
  });
  return tokens.accessToken;
}

/** True when a usable access token exists (may refresh without persisting cookies). */
export async function ensureValidAccessToken(): Promise<boolean> {
  return !!(await resolveAccessToken());
}

export async function resolveUserId(): Promise<string | undefined> {
  const token = await resolveAccessToken();
  if (!token) return undefined;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return undefined;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    const payload = JSON.parse(jsonPayload);
    return payload.sub ? String(payload.sub) : undefined;
  } catch {
    return undefined;
  }
}
