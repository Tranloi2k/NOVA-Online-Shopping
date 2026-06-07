import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import {
  ACCESS_EXPIRES_COOKIE,
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  isAccessTokenExpired,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  USER_ID_COOKIE,
} from "@/app/lib/auth-constants";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const expiresAt = req.cookies.get(ACCESS_EXPIRES_COOKIE)?.value;

  const needsRefresh =
    refreshToken && (!accessToken || isAccessTokenExpired(expiresAt));

  if (!needsRefresh) {
    return NextResponse.next();
  }

  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${apiUrl}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return NextResponse.next();
    }

    const data = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
      userId?: string | number;
    };

    const response = NextResponse.next();
    const isProd = process.env.NODE_ENV === "production";
    const newExpiresAt = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_MAX_AGE;

    response.cookies.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
      secure: isProd,
      sameSite: "lax",
    });
    response.cookies.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
      secure: isProd,
      sameSite: "lax",
    });
    response.cookies.set(ACCESS_EXPIRES_COOKIE, newExpiresAt.toString(), {
      httpOnly: true,
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
      secure: isProd,
      sameSite: "lax",
    });

    if (data.userId !== undefined) {
      response.cookies.set(USER_ID_COOKIE, String(data.userId), {
        path: "/",
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    return response;
  } catch {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
