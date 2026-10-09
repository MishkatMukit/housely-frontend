"use server";

import { serverFetch } from "@/lib/api/server";
import type { ApiResponse } from "@/types/api";

export interface ApplyState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export async function applyAction(
  _prev: ApplyState | undefined,
  formData: FormData,
): Promise<ApplyState> {
  const flatId = String(formData.get("flatId") || "").trim();
  const monthlyIncome = String(formData.get("monthlyIncome") || "").trim();
  const employment = String(formData.get("employment") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!flatId) {
    return { success: false, message: "Choose a flat to apply for." };
  }

  const payload: Record<string, unknown> = { flatId };
  if (monthlyIncome) payload.monthlyIncome = Number(monthlyIncome);
  if (employment) payload.employment = employment;
  if (message) payload.message = message;

  const { ok, body } = await serverFetch<ApiResponse>("/api/applications/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!ok) {
    return {
      success: false,
      message: body?.message || "Application could not be submitted",
    };
  }

  return {
    success: true,
    message: body.message || "Application submitted successfully",
  };
}
