"use server";

import { revalidatePath } from "next/cache";
import { approveApplication, rejectApplication } from "@/lib/api/owner";

export interface ReviewState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function approveApplicationAction(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing application." };

  const result = await approveApplication(id);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Application could not be approved.",
    };
  }

  revalidatePath("/owner/applications");
  revalidatePath("/owner");
  return {
    status: "success",
    message: result.body?.message ?? "Application approved.",
  };
}

export async function rejectApplicationAction(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("rejectionReason") ?? "").trim();

  if (!id) return { status: "error", message: "Missing application." };
  if (reason.length < 3) {
    return {
      status: "error",
      message: "Give a short reason (at least 3 characters).",
    };
  }

  const result = await rejectApplication(id, reason);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Application could not be rejected.",
    };
  }

  revalidatePath("/owner/applications");
  revalidatePath("/owner");
  return {
    status: "success",
    message: result.body?.message ?? "Application rejected.",
  };
}
