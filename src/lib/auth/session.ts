import { unstable_rethrow } from "next/navigation";
import { cache } from "react";
import { serverFetch } from "@/lib/api/server";
import type { ApiResponse, User } from "@/types/api";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const { ok, body } = await serverFetch<ApiResponse<User>>("/api/auth/me");
    if (!ok) return null;
    return body.data ?? null;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to get current user:", error);
    return null;
  }
});
