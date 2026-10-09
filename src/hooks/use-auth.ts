"use client";

import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return {
    user,
    token,
    isAuthenticated: Boolean(user),
    isTenant: user?.role === "TENANT",
    isOwner: user?.role === "OWNER",
    isAdmin: user?.role === "ADMIN" || user?.role === "SUPERADMIN",
    clearAuth,
  };
}
