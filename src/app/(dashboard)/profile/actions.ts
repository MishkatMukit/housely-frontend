"use server";

import { revalidatePath, updateTag } from "next/cache";
import { updateOwnerProfile } from "@/lib/api/owner";
import { updateTenantProfile } from "@/lib/api/tenant";
import { ownerProfileSchema } from "@/lib/validations/owner";
import { tenantProfileSchema } from "@/lib/validations/tenant";

export interface ProfileActionState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export const initialProfileState: ProfileActionState = {
  status: "idle",
  message: "",
};

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = tenantProfileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = Object.fromEntries(
    Object.entries(parsed.data).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(payload).length === 0) {
    return { status: "error", message: "Change at least one field to update." };
  }

  const result = await updateTenantProfile(payload);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Profile update failed.",
    };
  }

  updateTag("current-user");
  revalidatePath("/profile");
  revalidatePath("/tenant");

  return {
    status: "success",
    message: result.body?.message ?? "Profile updated successfully.",
  };
}

export async function updateOwnerProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = ownerProfileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = Object.fromEntries(
    Object.entries(parsed.data).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(payload).length === 0) {
    return { status: "error", message: "Change at least one field to update." };
  }

  const result = await updateOwnerProfile(payload);

  if (!result.ok) {
    return {
      status: "error",
      message: result.body?.message ?? "Profile update failed.",
    };
  }

  updateTag("current-user");
  revalidatePath("/profile");
  revalidatePath("/owner");

  return {
    status: "success",
    message: result.body?.message ?? "Profile updated successfully.",
  };
}
