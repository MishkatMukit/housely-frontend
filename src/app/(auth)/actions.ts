"use server";

import { cookies } from "next/headers";
import { serverFetch } from "@/lib/api/server";
import type { ApiResponse } from "@/types/api";

export interface ActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  redirectTo?: string;
}

async function persistCookies(setCookies: string[]) {
  const store = await cookies();
  for (const raw of setCookies) {
    const [pair] = raw.split(";");
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    const name = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    store.set(name, value, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function loginAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { ok, body, setCookies } = await serverFetch<ApiResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );

  if (!ok) {
    return { success: false, message: body?.message || "Login failed" };
  }

  await persistCookies(setCookies);
  return { success: true, message: body.message, redirectTo: "/" };
}

export async function registerAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { ok, body } = await serverFetch<ApiResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (!ok) {
    return { success: false, message: body?.message || "Registration failed" };
  }

  return {
    success: true,
    message: body.message,
    redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
  };
}

export async function verifyEmailAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "");
  const otp = String(formData.get("otp") || "");

  const { ok, body, setCookies } = await serverFetch<ApiResponse>(
    "/api/auth/verify-email",
    {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    },
  );

  if (!ok) {
    return { success: false, message: body?.message || "Verification failed" };
  }

  await persistCookies(setCookies);
  return { success: true, message: body.message, redirectTo: "/" };
}

export async function forgotPasswordAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "");

  const { ok, body } = await serverFetch<ApiResponse>(
    "/api/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );

  if (!ok) {
    return { success: false, message: body?.message || "Request failed" };
  }

  return {
    success: true,
    message: body.message,
    redirectTo: `/reset-password?email=${encodeURIComponent(email)}`,
  };
}

export async function resetPasswordAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "");
  const otp = String(formData.get("otp") || "");
  const newPassword = String(formData.get("newPassword") || "");

  const { ok, body } = await serverFetch<ApiResponse>(
    "/api/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    },
  );

  if (!ok) {
    return { success: false, message: body?.message || "Reset failed" };
  }

  return { success: true, message: body.message, redirectTo: "/login" };
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete("accessToken");
  store.delete("refreshToken");
}
