import type { NextAuthConfig } from "next-auth";
import {
  ACCESS_EXPIRES_COOKIE,
  isAccessTokenExpired,
  REFRESH_TOKEN_COOKIE,
} from "@/app/lib/auth-constants";

// Extend the Session type to include custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    expiresAt?: number;
    nearExpiry?: boolean;
  }
}

export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: 12 * 60 * 60, // 12 hours
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, cookies } }) {
      const isLoggedIn = !!auth?.user;
      const hasAccessToken = !!cookies.get("access_token")?.value;
      const hasRefreshToken = !!cookies.get(REFRESH_TOKEN_COOKIE)?.value;
      const accessExpired = isAccessTokenExpired(
        cookies.get(ACCESS_EXPIRES_COOKIE)?.value,
      );
      const hasValidSession =
        isLoggedIn &&
        ((hasAccessToken && !accessExpired) || hasRefreshToken);
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/customers") ||
        nextUrl.pathname.startsWith("/cart") ||
        nextUrl.pathname.startsWith("/checkout");

      if (isProtectedRoute) {
        if (hasValidSession) {
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (hasValidSession && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/products", nextUrl));
      }

      return true;
    },

    // ✅ JWT callback để kiểm tra expiry
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          // ✅ Set custom expiry time
          expiresAt: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
        };
      }

      // ✅ Check if token has expired
      if (
        typeof token.expiresAt === "number" &&
        Date.now() / 1000 > token.expiresAt
      ) {
        return null;
      }

      return token;
    },

    // ✅ Session callback để pass data to client
    async session({ session, token }) {
      if (token) {
        session.accessToken =
          typeof token.accessToken === "string" ? token.accessToken : undefined;
        session.expiresAt =
          typeof token.expiresAt === "number" ? token.expiresAt : undefined;

        // ✅ Check if close to expiry (optional warning)
        let timeLeft: number | undefined;
        if (typeof token.expiresAt === "number") {
          timeLeft = token.expiresAt - Math.floor(Date.now() / 1000);
          if (timeLeft < 24 * 60 * 60) {
            session.nearExpiry = true;
          }
        }

        if (token.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
