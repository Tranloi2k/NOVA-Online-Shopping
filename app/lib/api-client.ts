import {
  fetchTokenRefresh,
  resolveAccessToken,
  trySetAuthCookies,
} from "@/app/lib/auth-tokens";
import { REFRESH_TOKEN_COOKIE } from "@/app/lib/auth-constants";
import { cookies } from "next/headers";

export async function getAuthHeaders(
  extra?: Record<string, string>,
): Promise<HeadersInit> {
  const headers: Record<string, string> = { ...extra };

  const accessToken = await resolveAccessToken();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

export async function authFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const extra =
    init?.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : (init?.headers as Record<string, string> | undefined);

  let response = await fetch(url, {
    ...init,
    headers: await getAuthHeaders(extra),
  });

  if (response.status === 401) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
    const tokens = refreshToken
      ? await fetchTokenRefresh(refreshToken)
      : null;

    if (tokens) {
      await trySetAuthCookies({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: tokens.userId,
      });

      response = await fetch(url, {
        ...init,
        headers: {
          ...extra,
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    }
  }

  return response;
}
