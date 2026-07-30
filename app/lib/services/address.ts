"use server";
import { authFetch } from "@/app/lib/api-client";

export interface Address {
  id: number;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

const apiBase = () => process.env.NEXT_PUBLIC_EXTERNAL_API_URL;

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const json = JSON.parse(await res.text());
    return json.message || fallback;
  } catch {
    return fallback;
  }
}

export const getAddresses = async (): Promise<Address[]> => {
  const apiUrl = apiBase();
  if (!apiUrl) return [];
  try {
    const res = await authFetch(`${apiUrl}/addresses`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Failed to fetch addresses:", res.status);
      return [];
    }
    return (await res.json()) as Address[];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};

/** Returns the default address id (or the first one) for use at checkout. */
export const getDefaultAddressId = async (): Promise<number | null> => {
  const addresses = await getAddresses();
  if (addresses.length === 0) return null;
  const def = addresses.find((a) => a.isDefault) ?? addresses[0];
  return def.id;
};

export const createAddress = async (
  input: AddressInput,
): Promise<{ address?: Address; error?: string }> => {
  const apiUrl = apiBase();
  if (!apiUrl) return { error: "API URL not configured" };
  try {
    const res = await authFetch(`${apiUrl}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return { error: await parseError(res, "Failed to create address") };
    return { address: (await res.json()) as Address };
  } catch (error) {
    console.error("Error creating address:", error);
    return { error: "An unexpected error occurred" };
  }
};

export const updateAddress = async (
  id: number,
  input: Partial<AddressInput>,
): Promise<{ address?: Address; error?: string }> => {
  const apiUrl = apiBase();
  if (!apiUrl) return { error: "API URL not configured" };
  try {
    const res = await authFetch(`${apiUrl}/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return { error: await parseError(res, "Failed to update address") };
    return { address: (await res.json()) as Address };
  } catch (error) {
    console.error("Error updating address:", error);
    return { error: "An unexpected error occurred" };
  }
};

export const deleteAddress = async (
  id: number,
): Promise<{ success?: boolean; error?: string }> => {
  const apiUrl = apiBase();
  if (!apiUrl) return { error: "API URL not configured" };
  try {
    const res = await authFetch(`${apiUrl}/addresses/${id}`, { method: "DELETE" });
    if (!res.ok) return { error: await parseError(res, "Failed to delete address") };
    return { success: true };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { error: "An unexpected error occurred" };
  }
};

export const setDefaultAddress = async (
  id: number,
): Promise<{ address?: Address; error?: string }> => {
  const apiUrl = apiBase();
  if (!apiUrl) return { error: "API URL not configured" };
  try {
    const res = await authFetch(`${apiUrl}/addresses/${id}/default`, { method: "PATCH" });
    if (!res.ok) return { error: await parseError(res, "Failed to set default address") };
    return { address: (await res.json()) as Address };
  } catch (error) {
    console.error("Error setting default address:", error);
    return { error: "An unexpected error occurred" };
  }
};
