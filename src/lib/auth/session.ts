import { cacheLife, cacheTag } from "next/cache";
import { serverFetch } from "@/lib/api/server";
import type { ApiResponse, User } from "@/types/api";

export async function getCurrentUser(): Promise<User | null> {
  "use cache: private";
  cacheLife({ stale: 300 });
  cacheTag("current-user");

  try {
    const { ok, body } = await serverFetch<ApiResponse<User>>("/api/auth/me");
    if (!ok) return null;
    return body.data ?? null;
  } catch {
    return null;
  }
}
