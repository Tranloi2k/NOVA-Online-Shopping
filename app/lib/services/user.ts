"use server";
import { authFetch } from "@/app/lib/api-client";
import { CACHE_TAGS } from "@/app/lib/cache-tags";
import { resolveUserId } from "@/app/lib/auth-tokens";

export const getUser = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return null;
  }

  try {
    const id = await resolveUserId();
    if (!id) {
      return null;
    }

    const response = await authFetch(`${apiUrl}/user/${id}`, {
      method: "GET",
      cache: "no-store",
      next: {
        tags: [CACHE_TAGS.user, CACHE_TAGS.userId(id)],
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user:", response);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUser = async (
  data: { username?: string; email?: string; password?: string },
) => {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return { error: "API URL not configured" };
  }

  try {
    const resolvedId = await resolveUserId();
    if (!resolvedId) {
      return { error: "Unauthorized" };
    }

    const response = await authFetch(`${apiUrl}/user/${resolvedId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to update user:", errText);
      try {
        const errJson = JSON.parse(errText);
        return { error: errJson.message || "Failed to update profile" };
      } catch {
        return { error: "Failed to update profile" };
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "An unexpected error occurred" };
  }
};

export const getUserOrders = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return [];
  }

  try {
    const id = await resolveUserId();
    if (!id) {
      return [];
    }

    const response = await authFetch(`${apiUrl}/user/${id}/orders`, {
      method: "GET",
      cache: "no-store",
      next: {
        tags: ["orders", `user-orders-${id}`],
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user orders:", response);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

export const confirmOrder = async (
  sessionData: {
    stripeSessionId: string;
    total: number;
    orderType: string;
    productId?: number;
    quantity?: number;
  },
) => {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    return { error: "API URL not configured" };
  }

  try {
    const resolvedId = await resolveUserId();
    if (!resolvedId) {
      return { error: "Unauthorized" };
    }

    const response = await authFetch(`${apiUrl}/user/${resolvedId}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to confirm order:", errText);
      try {
        const errJson = JSON.parse(errText);
        return { error: errJson.message || "Failed to confirm order" };
      } catch {
        return { error: "Failed to confirm order" };
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error confirming order:", error);
    return { error: "An unexpected error occurred" };
  }
};

