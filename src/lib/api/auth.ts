import { apiClient } from "@/lib/api/ofetch";
import type { ApiResponse, User } from "@/types/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    apiClient<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/login",
      {
        method: "POST",
        body: data,
      },
    ),
  register: (data: RegisterPayload) =>
    apiClient<ApiResponse>("/auth/register", {
      method: "POST",
      body: data,
    }),
  verifyEmail: (data: VerifyEmailPayload) =>
    apiClient<
      ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
    >("/auth/verify-email", {
      method: "POST",
      body: data,
    }),
  me: () => apiClient<ApiResponse<User>>("/auth/me"),
  refreshToken: () =>
    apiClient<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/refresh-token",
      {
        method: "POST",
      },
    ),
  google: (idToken: string) =>
    apiClient<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/google",
      {
        method: "POST",
        body: { idToken },
      },
    ),
  forgotPassword: (data: ForgotPasswordPayload) =>
    apiClient<ApiResponse>("/auth/forgot-password", {
      method: "POST",
      body: data,
    }),
  resetPassword: (data: ResetPasswordPayload) =>
    apiClient<ApiResponse>("/auth/reset-password", {
      method: "POST",
      body: data,
    }),
};
