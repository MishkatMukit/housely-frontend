"use server";

import { revalidatePath } from "next/cache";
import { terminateLease } from "@/lib/api/owner";

export interface LeaseActionState {
  status: "idle" | "success" | "error";
  message: string;
}

export const initialLeaseState: LeaseActionState = {
  status: "idle",
  message: "",
};

export async function terminateLeaseAction(
  _prev: LeaseActionState,
  formData: FormData,
): Promise<LeaseActionState> {
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("rejectionReason") ?? "").trim();

  if (!id) return { status: "error", message: "Missing lease." };

  const result = await terminateLease(id, reason || undefined);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Lease could not be terminated.",
    };
  }

  revalidatePath("/owner/leases");
  revalidatePath("/owner/tenants");
  revalidatePath("/owner");
  return {
    status: "success",
    message: result.body?.message ?? "Lease terminated.",
  };
}
